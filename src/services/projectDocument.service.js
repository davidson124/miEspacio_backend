import ProjectDocument from "../models/projectDocument.model.js";

export const dbCreateProjectDocument = async (data) => ProjectDocument.create(data);

export const dbGetDocumentsByProject = async (projectId) =>
  ProjectDocument.find({ project: projectId, isDeleted: false }).sort({ createdAt: -1 });

export const dbGetDocumentsForClient = async (projectIds) =>
  ProjectDocument.find({ project: { $in: projectIds }, isDeleted: false, isVisibleToClient: true })
    .sort({ createdAt: -1 });

export const dbSoftDeleteDocument = async (id) =>
  ProjectDocument.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

export const dbSetVisibility = async (id, isVisibleToClient) =>
  ProjectDocument.findByIdAndUpdate(id, { isVisibleToClient }, { new: true });

