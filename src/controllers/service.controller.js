import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import { dbCreateService, dbGetPublicServices, dbGetAllServices, dbGetServiceById, dbUpdateServiceById, dbSoftDeleteServiceById } from '../services/service.service.js';

// Normaliza features:
const normalizeFeatures = (features) => {
  if (features === undefined) return [];
  if (!Array.isArray(features)) return null;
  // limpia strings vacíos y espacios
  return features
    .map((f) => String(f).trim())
    .filter((f) => f.length > 0);
};
// Público: obtener servicios visibles en frontend
export const getPublicServices = catchAsync(async (req, res) => {
  const services = await dbGetPublicServices();
  res.status(200).json({ message: "Servicios obtenidos correctamente.", services });
});
// Admin: obtener todos los servicios, incluye activos e inactivos para administración
export const getAllServicesAdmin = catchAsync(async (req, res) => {
  const services = await dbGetAllServices();
  res.status(200).json({ message: "Servicios obtenidos para administración.", services });
});
//Admin: crear servicio
export const createService = catchAsync(async (req, res) => {
  const { title, description, features, image, order } = req.body;
  if (!title || !description) {
    throw new AppError("title y description son obligatorios.", 400);
  }
  const normalizedFeatures = normalizeFeatures(features);
  if (normalizedFeatures === null) {
    throw new AppError("features debe ser un arreglo de strings.", 400);
  }
  const service = await dbCreateService({
    title: String(title).trim(),
    description: String(description).trim(),
    features: normalizedFeatures,
    image,
    order
  });
  res.status(201).json({ message: "Servicio creado correctamente.", service });
});
// Admin: actualizar servicio
export const updateService = catchAsync(async (req, res) => {
  const { id } = req.params;
  const allowed = ["title", "description", "features", "image", "order", "isActive"];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }
  if (Object.keys(updates).length === 0) {
    throw new AppError("No se proporcionaron campos para actualizar.", 400);
  }
  // Normalizaciones
  if (updates.title) updates.title = String(updates.title).trim();
  if (updates.description) updates.description = String(updates.description).trim();
  if (updates.features !== undefined) {
    const normalizedFeatures = normalizeFeatures(updates.features);
    if (normalizedFeatures === null) {
      throw new AppError("features debe ser un arreglo de strings.", 400);
    }
    updates.features = normalizedFeatures;
  }
  const service = await dbUpdateServiceById(id, updates);
  if (!service) {
    throw new AppError("Servicio no encontrado.", 404);
  }
  res.status(200).json({ message: "Servicio actualizado correctamente.", service });
});
// Admin: activar o desactivar un servicio
export const toggleServiceStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const service = await dbGetServiceById(id);
  if (!service) {
    throw new AppError("Servicio no encontrado.", 404);
  }
  service.isActive = !service.isActive;
  await service.save();
  res.status(200).json({ message: `Servicio ${service.isActive ? "activado" : "desactivado"} correctamente.`, service });
});
// Admin: soft delete, en este caso solo lo desactivamos
export const deleteService = catchAsync(async (req, res) => {
  const { id } = req.params;
  const service = await dbSoftDeleteServiceById(id);
  if (!service) {
    throw new AppError("Servicio no encontrado.", 404);
  }
  res.status(200).json({ message: "Servicio eliminado (desactivado) correctamente.", service });
});