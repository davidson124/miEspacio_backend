import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import {dbCreateWork, dbGetPublicWorks, dbGetPublicWorkById, dbUpdateWorkById,dbSoftDeleteWorkById } from '../services/works.service.js';

const normalizeCategory = (value) => String(value).toLowerCase().trim();

const normalizeFeatures = (features) => {
  if (features === undefined) return [];
  if (!Array.isArray(features)) return null;
  // limpia strings vacíos y espacios
  return features
    .map((f) => String(f).trim())
    .filter((f) => f.length > 0);
};

export const createWork = catchAsync(async (req, res) => {
  const { title, category, location, year, areaM2, cover, features, isPublished } = req.body;
  // 1) Validaciones base
  if (!title || !category || !location?.city || !location?.country || !year || !areaM2) {
    throw new AppError("Faltan datos obligatorios de la obra.", 400);
  }
  // 2) Cover obligatorio (Cloudinary)
  if (!cover?.url || !cover?.thumbUrl) {
    throw new AppError("La imagen principal (cover) es obligatoria.", 400);
  }
  // 3) Features opcional pero si viene debe ser array
  const normalizedFeatures = normalizeFeatures(features);
  if (normalizedFeatures === null) {
    throw new AppError("features debe ser un arreglo de strings.", 400);
  }
  const newWork = {
    title: String(title).trim(),
    category: normalizeCategory(category),
    location: {
      city: String(location.city).trim(),
      country: String(location.country).trim()
    },
    year: Number(year),
    areaM2: Number(areaM2),
    cover: {
      url: String(cover.url).trim(),
      thumbUrl: String(cover.thumbUrl).trim(),
      publicId: cover.publicId ? String(cover.publicId).trim() : undefined
    },
    features: normalizedFeatures,
    isPublished: isPublished ?? true
  };
  const work = await dbCreateWork(newWork);
  res.status(201).json({ message: "Obra creada correctamente.", work });
});
export const getPublicWorks = catchAsync(async (req, res) => {
  const { category } = req.query;
  const filter = {};
  if (category) filter.category = normalizeCategory(category);
  const works = await dbGetPublicWorks(filter);
  res.status(200).json({ message: "Obras públicas obtenidas correctamente.", works });
});
export const getWorkByIdPublic = catchAsync(async (req, res) => {
  const { id } = req.params;
  const work = await dbGetPublicWorkById(id);
  if (!work) throw new AppError("Obra no encontrada.", 404);
  res.status(200).json({ message: "Obra obtenida correctamente.", work });
});
export const updateWork = catchAsync(async (req, res) => {
  const { id } = req.params;
  const allowed = ["title", "category", "location", "year", "areaM2", "cover", "features", "isPublished"];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  if (Object.keys(updates).length === 0) {
    throw new AppError("No se proporcionaron campos para actualizar.", 400);
  }
  // Normalizaciones
  if (updates.title) updates.title = String(updates.title).trim();
  if (updates.category) updates.category = normalizeCategory(updates.category);
  if (updates.location) {
    if (!updates.location.city || !updates.location.country) {
      throw new AppError("location debe incluir city y country.", 400);
    }
    updates.location.city = String(updates.location.city).trim();
    updates.location.country = String(updates.location.country).trim();
  }
  if (updates.year !== undefined) updates.year = Number(updates.year);
  if (updates.areaM2 !== undefined) updates.areaM2 = Number(updates.areaM2);
  if (updates.cover) {
    if (!updates.cover.url || !updates.cover.thumbUrl) {
      throw new AppError("cover debe incluir url y thumbUrl.", 400);
    }
    updates.cover.url = String(updates.cover.url).trim();
    updates.cover.thumbUrl = String(updates.cover.thumbUrl).trim();
    if (updates.cover.publicId) updates.cover.publicId = String(updates.cover.publicId).trim();
  }
  if (updates.features !== undefined) {
    const normalizedFeatures = normalizeFeatures(updates.features);
    if (normalizedFeatures === null) { throw new AppError("features debe ser un arreglo de strings.", 400); }
    updates.features = normalizedFeatures;
  }
  const work = await dbUpdateWorkById(id, updates);
  if (!work) throw new AppError("Obra no encontrada.", 404);
  res.status(200).json({ message: "Obra actualizada correctamente.", work });
});
export const deleteWork = catchAsync(async (req, res) => {
  const { id } = req.params;
  const work = await dbSoftDeleteWorkById(id);
  if (!work) throw new AppError("Obra no encontrada.", 404);
  res.status(200).json({ message: "Obra eliminada (soft delete)." });
});