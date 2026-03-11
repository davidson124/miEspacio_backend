import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import Project from "../models/project.model.js";
import Quote from "../models/quote.model.js";
import { dbGetUserById } from "../services/user.service.js";
import { dbCreateProject, dbGetProjectById, dbGetProjectsByClient, dbGetProjectsByArchitect, dbGetAllProjects } from "../services/project.service.js";
import { deleteFromCloudinary } from "../services/cloudinar.service.js";
import getQuoteServiceTitle from "../helpers/getQuoteServiceTitle.js";

/*
  Admin/Architect: crear proyecto a partir de una cotización aprobada.

  Reglas:
  - la cotización debe existir
  - debe estar aprobada por el cliente
  - no debe tener proyecto ya creado
  - el arquitecto debe existir y tener rol architect
*/
export const createProjectFromQuote = catchAsync(async (req, res) => {
  const { quoteId } = req.params;

  const {
    architectId,
    title,
    budget,
    location,
    areaM2,
    startDate,
    estimatedEndDate,
    cover
  } = req.body;

  const quote = await Quote.findById(quoteId)
    .populate("user")
    .populate("service", "title");

  if (!quote) {
    throw new AppError("Cotización no encontrada.", 404);
  }

  // Debe haber sido aceptada por el cliente
  if (quote.status !== "aprobada" || !quote.isAcceptedByClient) {
    throw new AppError("La cotización debe estar aprobada para crear un proyecto.", 400);
  }

  // Evitar duplicar proyecto
  if (quote.project) {
    throw new AppError("Esta cotización ya tiene un proyecto asociado.", 400);
  }

  // Validar arquitecto
  const architect = await dbGetUserById(architectId);

  if (!architect || architect.role !== "architect") {
    throw new AppError("Arquitecto no válido.", 400);
  }

  // Validar portada
  if (!cover?.url || !cover?.thumbUrl) {
    throw new AppError("La portada del proyecto es obligatoria.", 400);
  }

  const serviceTitle = getQuoteServiceTitle(quote);

  /*
    Crear proyecto.
    Si no envías title, generamos uno automáticamente.
  */
  const project = await dbCreateProject({
    title: title || `${quote.projectType} - ${serviceTitle} - ${quote.location}`,
    client: quote.user._id,
    architect: architect._id,
    relatedQuote: quote._id,
    budget: budget ?? quote.proposalData?.total ?? quote.estimatedBudget,
    location: location || {
      city: "N/A",
      country: "N/A"
    },
    areaM2,
    startDate,
    estimatedEndDate,
    cover
  });

  /*
    Conectar quote -> project
  */
  quote.project = project._id;
  quote.status = "contratada";

  await quote.save();

  res.status(201).json({
    message: "Proyecto creado correctamente desde la cotización.",
    project,
    quote
  });
});
// CLIENTE: mis proyectos
export const getMyProjects = catchAsync(async (req, res) => {
  // El middleware authenticationUser agrega el payload del JWT
  const userId = req.payload.id;
  if (!userId) {
    throw new AppError("Usuario no autenticado.", 401);
  }
  // Traemos datos del arquitecto asociados
  const projects = await Project.find({
      client: userId,
      isDeleted: false
  })
  .populate("architect", "name lastName email")
  .sort({ createdAt: -1 });// Traemos datos del arquitecto asociados

  res.status(200).json({
    message: "Proyectos del cliente obtenidos correctamente.",
    projects
  });
});

// ARCHITECT: asignados
export const getAssignedProjects = catchAsync(async (req, res) => {
  const { id: userId, role } = req.payload;
  if (role !== "architect") throw new AppError("No autorizado.", 403);

  const projects = await dbGetProjectsByArchitect(userId);
  res.json({ projects });
});

// ADMIN: todos
export const getAllProjects = catchAsync(async (req, res) => {
  const { role } = req.payload;
  if (role !== "admin") throw new AppError("No autorizado.", 403);

  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const projects = await dbGetAllProjects(filter);
  res.json({ projects });
});

// VER detalle con permisos (admin o client dueño o architect asignado)
export const getProjectById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { id: userId, role } = req.payload;

  const project = await dbGetProjectById(id);
  if (!project) throw new AppError("Proyecto no encontrado.", 404);

  const isClient = project.client?._id?.toString() === userId;
  const isArchitect = project.architect?._id?.toString() === userId;

  if (role === "admin" || isClient || isArchitect) {
    return res.json({ project });
  }
  throw new AppError("No autorizado.", 403);
});

// ADMIN/ARCHITECT: actualizar fases + progreso general
export const updateProjectProgress = catchAsync(async (req, res) => {
  //id del proyecto desde la URL
  const { id } = req.params;
  //Datos del usuario autenticado
  const { id: userId, role } = req.payload;

  if (!["admin", "architect"].includes(role)) throw new AppError("No autorizado.", 403);
  //Buscar proyecto en Mongo
  const project = await Project.findById(id);
  if (!project || project.isDeleted) throw new AppError("Proyecto no encontrado.", 404);
  // Si es arquitecto, solo puede modificar proyectos asignados a él
  if (role === "architect" && project.architect.toString() !== userId) {
    throw new AppError("No autorizado para modificar este proyecto.", 403);
  }
  const { phases, progressGeneral } = req.body;
  // Validar que venga al menos phases o progressGeneral
  if (!phases && progressGeneral === undefined) {
    throw new AppError("Debes enviar phases o progressGeneral.", 400);
  }
  //Si envían phases: 1. verificamos que sea un array 2. verificamos que cada fase tenga name y progress válidos

    if (phases) {
    if (!Array.isArray(phases)) {
      throw new AppError("phases debe ser un arreglo.", 400);
    }

    for (const phase of phases) {
      if (!phase.name || phase.progress === undefined) {
        throw new AppError("Cada fase debe tener name y progress.", 400);
      }

      if (phase.progress < 0 || phase.progress > 100) {
        throw new AppError("El progreso de cada fase debe estar entre 0 y 100.", 400);
      }
    }

    // Reemplazamos las fases del proyecto
    project.phases = phases;
  }
  /*
    Si envían progressGeneral manualmente, lo usamos.
    Si no lo envían pero sí mandan phases, lo calculamos automáticamente
    como el promedio del progreso de todas las fases.
  */
  if (progressGeneral !== undefined) {
    if (progressGeneral < 0 || progressGeneral > 100) {
      throw new AppError("progressGeneral debe estar entre 0 y 100.", 400);
    }

    project.progressGeneral = progressGeneral;
  } else if (phases) {
    const total = phases.reduce((acc, phase) => acc + Number(phase.progress), 0);
    const average = total / phases.length;

    // redondeamos a entero
    project.progressGeneral = Math.round(average);
  }

  // Guardamos cambios
  await project.save();

  res.status(200).json({
    message: "Progreso del proyecto actualizado correctamente.",
    project
  });
});

// ADMIN/ARCHITECT: agregar imagen a galería (ya subida a Cloudinary)
export const addProjectGalleryImages = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { id: userId, role } = req.payload;

  const { images } = req.body;

  if (!Array.isArray(images) || images.length === 0) {
    throw new AppError("Debes enviar un arreglo de imágenes.", 400);
  }

  const project = await Project.findById(id);
  if (!project || project.isDeleted) {
    throw new AppError("Proyecto no encontrado.", 404);
  }

  if (role === "architect" && project.architect.toString() !== userId) {
    throw new AppError("No autorizado.", 403);
  }

  for (const image of images) {
    if (!image.url) {
      throw new AppError("Cada imagen debe tener url.", 400);
    }

    project.gallery.push({
      url: image.url,
      thumbUrl: image.thumbUrl || null,
      publicId: image.publicId || null,
      resourceType: image.resourceType || "image"
    });
  }

  await project.save();

  res.status(201).json({
    message: "Imágenes agregadas a la galería.",
    project
  });
});

export const removeProjectGalleryImage = catchAsync(async (req, res) => {
  const { id, imageIndex } = req.params;
  const { id: userId, role } = req.payload;

  const project = await Project.findById(id);

  if (!project || project.isDeleted) {
    throw new AppError("Proyecto no encontrado.", 404);
  }

  if (role === "architect" && project.architect.toString() !== userId) {
    throw new AppError("No autorizado.", 403);
  }

  const index = Number(imageIndex);

  if (Number.isNaN(index) || index < 0 || index >= project.gallery.length) {
    throw new AppError("Índice de imagen inválido.", 400);
  }

  const imageToDelete = project.gallery[index];

  if (imageToDelete.publicId) {
    await deleteFromCloudinary(
      imageToDelete.publicId,
      imageToDelete.resourceType || "image"
    );
  }

  project.gallery.splice(index, 1);

  await project.save();

  res.status(200).json({
    message: "Imagen eliminada de la galería.",
    project
  });
});