import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import Project from "../models/project.model.js";
import Quote from "../models/quote.model.js";
import { dbGetUserById } from "../services/user.service.js";
import { dbCreateProject, dbGetProjectById, dbGetProjectsByClient, dbGetProjectsByArchitect, dbGetAllProjects } from "../services/project.service.js";
import { deleteFromCloudinary } from "../services/cloudinar.service.js";


// CLIENTE: aceptar propuesta (cambia quote.isAcceptedByClient)
export const acceptQuote = catchAsync(async (req, res) => {
  const { id: quoteId } = req.params;
  const { id: userId } = req.payload;

  const quote = await Quote.findById(quoteId);
  if (!quote) throw new AppError("Cotización no encontrada.", 404);

  if (quote.user.toString() !== userId) throw new AppError("No autorizado.", 403);

  // opcional: exigir que ya exista propuesta_generada
  if (quote.status !== "propuesta_generada") {
    throw new AppError("Aún no hay propuesta para aceptar.", 400);
  }
  //Validar si hay campos vacios
  if (
    !quote.proposalData ||
    !Array.isArray(quote.proposalData.items) ||
    quote.proposalData.items.length === 0
  ) {
    throw new AppError("La cotización no tiene una propuesta válida para aceptar.", 400);
  }
  // Comprobar propuesta
  if (quote.isAcceptedByClient) {
    throw new AppError("La cotización ya fue aceptada.", 400);
  }

  quote.isAcceptedByClient = true;
  quote.acceptedAt = new Date();
  quote.status = "aprobada";
  await quote.save();

  res.status(200).json({ message: "Propuesta aceptada correctamente.", quote });
});

// ADMIN/ARCHITECT: crear proyecto desde una quote
export const createProjectFromQuote = catchAsync(async (req, res) => {
  const { quoteId } = req.params;
  const { architectId, title, budget, location, areaM2, startDate, estimatedEndDate, cover } = req.body;

  const quote = await Quote.findById(quoteId).populate("user");
  if (!quote) throw new AppError("Cotización no encontrada.", 404);

  if (!quote.isAcceptedByClient) throw new AppError("El cliente aún no ha aceptado la propuesta.", 400);

  if (quote.project) throw new AppError("Esta cotización ya tiene un proyecto asociado.", 400);

  const architect = await dbGetUserById(architectId);
  if (!architect || architect.role !== "architect") throw new AppError("Arquitecto no válido.", 400);

  if (!cover?.url || !cover?.thumbUrl) {
    throw new AppError("La imagen principal del proyecto es obligatoria.", 400);
  }

  const project = await dbCreateProject({
    title: title || `${quote.projectType} - ${quote.location}`,
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

  quote.project = project._id;
  quote.status = "contratada"; // trazabilidad de negocio
  
  await quote.save();

  res.status(201).json({ message: "Proyecto creado desde cotización.", project, quote });
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
  const { id } = req.params;
  const { id: userId, role } = req.payload;

  if (!["admin", "architect"].includes(role)) throw new AppError("No autorizado.", 403);

  const project = await Project.findById(id);
  if (!project || project.isDeleted) throw new AppError("Proyecto no encontrado.", 404);

  if (role === "architect" && project.architect.toString() !== userId) {
    throw new AppError("No autorizado.", 403);
  }

  const { phases, progressGeneral } = req.body;

  if (phases) project.phases = phases;

  if (progressGeneral !== undefined) {
    project.progressGeneral = progressGeneral;
  } else if (phases) {
    const avg = phases.reduce((acc, p) => acc + Number(p.progress || 0), 0) / (phases.length || 1);
    project.progressGeneral = Math.round(avg);
  }

  await project.save();
  res.json({ message: "Progreso actualizado.", project });
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