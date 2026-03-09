import Project from "../models/project.model.js";

export const dbCreateProject = async (data) => Project.create(data);

export const dbGetProjectById = async (id) =>
  Project.findOne({ _id: id, isDeleted: false })
    .populate("client architect relatedQuote");

export const dbGetProjectsByClient = async (clientId) =>
  Project.find({ client: clientId, isDeleted: false }).sort({ createdAt: -1 });

export const dbGetProjectsByArchitect = async (architectId) =>
  Project.find({ architect: architectId, isDeleted: false }).sort({ createdAt: -1 });

export const dbGetAllProjects = async (filter = {}) =>
  Project.find({ isDeleted: false, ...filter }).sort({ createdAt: -1 });

export const dbUpdateProjectById = async (id, updates) =>
  Project.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

export const dbSoftDeleteProjectById = async (id) =>
  Project.findByIdAndUpdate(id, { isDeleted: true }, { new: true });