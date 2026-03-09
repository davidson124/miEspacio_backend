import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import Project from "../models/project.model.js";
import { dbCreateProjectDocument, dbGetDocumentsByProject, dbGetDocumentsForClient, dbSoftDeleteDocument, dbSetVisibility } from "../services/projectDocument.service.js";
import { dbGetProjectsByClient } from "../services/project.service.js";

export const createProjectDocument = catchAsync(async (req, res) => {
  const { role, id: userId } = req.payload;

  if (!["admin", "architect"].includes(role)) {
    throw new AppError("No autorizado.", 403);
  }

  const {
    projectId,
    title,
    category,
    fileUrl,
    publicId,
    isVisibleToClient
  } = req.body;

  if (!projectId || !title || !fileUrl) {
    throw new AppError("Faltan datos obligatorios.", 400);
  }

  const project = await Project.findById(projectId);
  if (!project || project.isDeleted) {
    throw new AppError("Proyecto no encontrado.", 404);
  }

  if (role === "architect" && project.architect.toString() !== userId) {
    throw new AppError("No autorizado.", 403);
  }

  const document = await dbCreateProjectDocument({
    project: projectId,
    title,
    category,
    fileUrl,
    publicId,
    uploadedBy: userId,
    isVisibleToClient: isVisibleToClient ?? true
  });

  res.status(201).json({
    message: "Documento guardado correctamente.",
    document
  });
});

export const getDocumentsByProject = catchAsync(async (req, res) => {
  const { projectId } = req.query;
  if (!projectId) throw new AppError("projectId requerido.", 400);
  const docs = await dbGetDocumentsByProject(projectId);
  res.json({ documents: docs });
});

export const getMyDocuments = catchAsync(async (req, res) => {
  const { id: userId } = req.payload;
  const projects = await dbGetProjectsByClient(userId);
  const ids = projects.map(p => p._id);
  const docs = await dbGetDocumentsForClient(ids);
  res.json({ documents: docs });
});

export const setDocumentVisibility = catchAsync(async (req, res) => {
  const { role } = req.payload;
  if (role !== "admin") throw new AppError("Solo admin.", 403);

  const { id } = req.params;
  const { isVisibleToClient } = req.body;

  const doc = await dbSetVisibility(id, Boolean(isVisibleToClient));
  if (!doc) throw new AppError("Documento no encontrado.", 404);

  res.json({ message: "Visibilidad actualizada.", document: doc });
});

export const deleteDocument = catchAsync(async (req, res) => {
  const { role } = req.payload;
  if (role !== "admin") throw new AppError("Solo admin.", 403);

  const { id } = req.params;
  const doc = await dbSoftDeleteDocument(id);
  if (!doc) throw new AppError("Documento no encontrado.", 404);

  res.json({ message: "Documento eliminado.", document: doc });
});