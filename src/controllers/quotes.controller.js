import PDFDocument from "pdfkit";
import Quote from "../models/quote.model.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { dbCreateQuote, dbGetQuotesByUser, dbGetAllQuotes, dbUpdateQuoteById, dbGetQuoteById } from "../services/quote.service.js";
import { dbGetUserById } from "../services/user.service.js";
import { dbGetServiceById } from "../services/service.service.js";
import getQuoteServiceTitle from "../helpers/getQuoteServiceTitle.js";

//Cliente acepta propuesta 
export const acceptQuote = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.payload?.id;
  if (!userId) {
    throw new AppError("Usuario no autenticado.", 401);
  }
  const quote = await dbGetQuoteById(id);
  if (!quote) {
    throw new AppError("Cotización no encontrada.", 404);
  }
  // Solo el dueño puede aceptar su cotización
  if (quote.user.toString() !== userId) {
    throw new AppError("No autorizado.", 403);
  }
  // Solo se puede aceptar si la propuesta ya fue generada
  if (quote.status !== "propuesta_generada") {
    throw new AppError("La cotización no puede ser aceptada en su estado actual.", 400);
  }

  // Evitar aceptar dos veces
  if (quote.isAcceptedByClient) {
    throw new AppError("La cotización ya fue aceptada.", 400);
  }
  quote.status = "aprobada";
  quote.isAcceptedByClient = true;
  quote.acceptedAt = new Date();
  await quote.save();
  res.status(200).json({ message: "Cotización aceptada correctamente.", quote });
});

//Generar PDF de la cotización
export const generateQuotePDF = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.payload?.id;
  const role = req.payload?.role;
  const quote = await Quote.findById(id)
    .populate("user")
    .populate("service", "title");
  if (!quote) {
    throw new AppError("Cotización no encontrada.", 404);
  }

  // Solo admin o dueño de la cotización
  if (role !== "admin" && quote.user._id.toString() !== userId) {
    throw new AppError("No autorizado.", 403);
  }
  const allowedStatuses = ["propuesta_generada", "aprobada", "contratada"];
  if (!allowedStatuses.includes(quote.status)) {
    throw new AppError("La cotización no tiene una propuesta disponible para imprimir.", 400);
  }
  if (
    !quote.proposalData ||
    !Array.isArray(quote.proposalData.items) ||
    quote.proposalData.items.length === 0
  ) {
    throw new AppError("La cotización no tiene datos suficientes para generar PDF.", 400);
  }
  const money = (n) => {
    const num = Number(n || 0);
    return `$ ${num.toLocaleString("es-CO")}`;
  };
  const serviceTitle = getQuoteServiceTitle(quote);
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${quote.quoteCode}.pdf`
  );
  doc.pipe(res);
  doc.fontSize(18).text("Mi Espacio /n architecture studio", { align: "center" });
  doc
    .fontSize(10)
    .text("NIT: 123456789 | Bogotá, Colombia | carlos.andres22@hotmail.es", {
      align: "center"
    });
  doc.moveDown();
  doc.fontSize(12).text(`Cotización: ${quote.quoteCode}`);
  doc.text(`Fecha de emisión: ${new Date().toLocaleDateString("es-CO")}`);
  if (quote.proposalData.validUntil) {
    doc.text(
      `Vigencia hasta: ${new Date(quote.proposalData.validUntil).toLocaleDateString("es-CO")}`
    );
  }
  doc.text(`Estado: ${quote.status}`);
  doc.moveDown();
  doc.fontSize(12).text("Cliente", { underline: true });
  doc.fontSize(11).text(`${quote.clientSnapshot.name} ${quote.clientSnapshot.lastName}`);
  doc.text(`Email: ${quote.clientSnapshot.email}`);
  doc.moveDown();
  doc.fontSize(12).text("Proyecto", { underline: true });
  doc.fontSize(11).text(`Ubicación: ${quote.location}`);
  doc.text(`Tipo de proyecto: ${quote.projectType}`);
  doc.text(`Servicio específico: ${serviceTitle}`);
  doc.text(`Tiempo estimado: ${quote.estimatedTime}`);
  doc.text(`Presupuesto estimado (referencia): ${money(quote.estimatedBudget)}`);
  if (quote.description) {
    doc.text(`Descripción: ${quote.description}`);
  }
  doc.moveDown();
  doc.fontSize(12).text("Detalle de la propuesta", { underline: true });
  doc.moveDown(0.5);

  const startX = doc.x;
  let y = doc.y;
  const colDesc = startX;
  const colQty = startX + 280;
  const colUnit = startX + 340;
  const colTotal = startX + 450;

  doc.fontSize(10).text("Descripción", colDesc, y);
  doc.text("Cant.", colQty, y);
  doc.text("V. unit", colUnit, y);
  doc.text("Total", colTotal, y);

  y += 15;
  doc.moveTo(startX, y).lineTo(startX + 500, y).stroke();
  y += 8;

  quote.proposalData.items.forEach((it) => {
    doc.fontSize(10).text(String(it.description || ""), colDesc, y, { width: 270 });
    doc.text(String(it.quantity ?? ""), colQty, y);
    doc.text(money(it.unitPrice), colUnit, y);
    doc.text(money(it.total), colTotal, y);

  y += 20;
    if (y > 720) {
      doc.addPage();
      y = 80;
    }
  });

  y += 10;
  doc.moveTo(startX, y).lineTo(startX + 500, y).stroke();
  y += 10;

  const subtotal = quote.proposalData.subtotal ?? 0;
  const tax = quote.proposalData.tax ?? 0;
  const total = quote.proposalData.total ?? 0;
  const taxAmount = subtotal * (Number(tax) / 100);

  doc.fontSize(11).text(`Subtotal: ${money(subtotal)}`, colUnit, y, { align: "right" });
  y += 15;
  doc.text(`IVA (${tax}%): ${money(taxAmount)}`, colUnit, y, { align: "right" });
  y += 15;
  doc.fontSize(12).text(`Total: ${money(total)}`, colUnit, y, { align: "right" });
  y += 25;

  if (quote.proposalData.notes) {
    doc.fontSize(10).text("Notas:", startX, y);
    y += 15;
    doc.fontSize(10).text(quote.proposalData.notes, startX, y, { width: 500 });
    y += 20;
  }
  doc.moveDown(2);
  doc.fontSize(9).text(
    "Esta cotización es una propuesta comercial sujeta a validación técnica y disponibilidad. Los valores pueden variar según alcance final del proyecto.",
    { align: "justify" }
  );
  doc.end();
});

//Generar propuesta formal
export const generateProposal = catchAsync(async (req, res) => {
  const { id } = req.params;
  const quote = await dbGetQuoteById(id);
  if (!quote) {
    throw new AppError("Cotización no encontrada.", 404);
  }
  if (quote.status !== "pendiente" && quote.status !== "en_revision") {
    throw new AppError("La propuesta ya fue generada o no puede modificarse.", 400);
  }
  const { items, tax = 0, validUntil, notes } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError("La propuesta debe contener al menos un item.", 400);
  }
  let subtotal = 0;
  const normalizedItems = items.map((item) => {
    const total = Number(item.quantity) * Number(item.unitPrice);
    subtotal += total;
    return {
      description: item.description,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      total
    };
  });
  const taxAmount = subtotal * (Number(tax) / 100);
  const total = subtotal + taxAmount;
  quote.proposalData = {
    items: normalizedItems,
    subtotal,
    tax,
    total,
    validUntil,
    notes
  };
  quote.status = "propuesta_generada";
  await quote.save();
  res.status(200).json({ message: "Propuesta generada exitosamente.", quote });
});

// Obtener cotización por id
export const getQuoteById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.payload?.id;
  const role = req.payload?.role;
  const quote = await dbGetQuoteById(id);
  if (!quote) {
    throw new AppError("Cotización no encontrada.", 404);
  }
  if (role !== "admin" && quote.user._id?.toString() !== userId && quote.user.toString() !== userId)   {
    throw new AppError("No autorizado.", 403);
  }
  const quoteObj = quote.toObject();
  quoteObj.serviceTitle = getQuoteServiceTitle(quoteObj);
  res.status(200).json({ message: "Cotización obtenida exitosamente.", quote: quoteObj });
});

//Crear cotización
export const createQuote = catchAsync(async (req, res) => {
  const userId = req.payload?.id;
  if (!userId) {
    throw new AppError("Usuario no autenticado.", 401);
  }
  const user = await dbGetUserById(userId);
  if (!user || !user.isActive) {
    throw new AppError("Usuario no válido.", 401);
  }
  const {
    projectType,
    serviceId,
    estimatedBudget,
    estimatedTime,
    location,
    description,
    preferredContactMethod
  } = req.body;
  if (!projectType || !serviceId || !estimatedBudget || !estimatedTime || !location) {
    throw new AppError("Faltan datos de consulta.", 400);
  }
  const service = await dbGetServiceById(serviceId);
  if (!service || !service.isActive) {
    throw new AppError("Servicio no válido o inactivo.", 400);
  }
  const newQuote = await dbCreateQuote({
    user: userId,
    clientSnapshot: {
      name: user.name,
      lastName: user.lastName,
      email: user.email
    },
    projectType,
    service: service._id,
    serviceSnapshot: {
      title: service.title
    },
    estimatedBudget,
    location,
    estimatedTime,
    description,
    preferredContactMethod
  });
  res.status(201).json({ message: "Cotización creada exitosamente.", quote: newQuote });
});

//Usuario: ver sus cotizaciones
export const getMyQuotes = catchAsync(async (req, res) => {
  const userId = req.payload?.id;
  const quotes = await dbGetQuotesByUser(userId);
  const formattedQuotes = quotes.map((quote) => {
    const quoteObj = quote.toObject();
    quoteObj.serviceTitle = getQuoteServiceTitle(quoteObj);
    return quoteObj;
  });
  res.status(200).json({ message: "Cotizaciones obtenidas exitosamente.", quotes: formattedQuotes });
});

//Admin: ver todas las cotizaciones
export const getAllQuotesAdmin = catchAsync(async (req, res) => {
  const quotes = await dbGetAllQuotes();
  const formattedQuotes = quotes.map((quote) => {
    const quoteObj = quote.toObject();
    quoteObj.serviceTitle = getQuoteServiceTitle(quoteObj);
    return quoteObj;
  });
  res.status(200).json({ message: "Todas las cotizaciones.", quotes: formattedQuotes });
});

// Admin: actualizar cotización
export const updateQuoteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const allowed = ["status", "preferredContactMethod", "description"];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }
  if (Object.keys(updates).length === 0) {
    throw new AppError("No se proporcionaron campos válidos para actualizar.", 400);
  }
  const updated = await dbUpdateQuoteById(id, updates);
  if (!updated) {
    throw new AppError("Cotización no encontrada.", 404);
  }
  res.status(200).json({ message: "Cotización actualizada exitosamente.", quote: updated });
});

//Admin: archivar cotización
export const archiveQuoteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updated = await dbUpdateQuoteById(id, {
    status: "archivada",
    isDeleted: true
  });
  if (!updated) {
    throw new AppError("Cotización no encontrada.", 404);
  }
  res.status(200).json({ message: "Cotización archivada exitosamente.", quote: updated });
});