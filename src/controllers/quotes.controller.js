import PDFDocument from 'pdfkit';
import Quote from "../models/quote.model.js";
import AppError from "../utils/AppError.js";
import catchAsync from '../utils/catchAsync.js';
import { dbCreateQuote, dbGetQuotesByUser, dbGetAllQuotes, dbUpdateQuoteById } from "../services/quote.service.js";
import { dbGetUserById } from "../services/user.service.js";
import { set } from 'mongoose';

export const generateQuotePDF = catchAsync(async (req, res) => {
    const {id} = req.params;
    const quote = await Quote.findById(id);
    if(!quote) throw new AppError("Cotización no encontrada.", 404);
    //Validar que la cotización esté en estado "propuesta_generada"
    if(quote.status !== "propuesta_generada"){
        throw new AppError("La cotización no ha sido generada aún.", 400);
    }
    //Validar que la cotización tenga datos suficientes para generar el PDF
    if(!quote.status || !Array.isArray(quote.proposalData.items) || quote.proposalData.items.length === 0){
        throw new AppError("La cotización no tiene datos suficientes para generar el PDF.", 400);
    }
    //Función para formatear números como moneda
    const money = (n) => {
        const num = Number(n || 0);
        return `$ ${num.toLocaleString("es-CO")}`;
    };
    //Crear documento PDF
    const doc = new PDFDocument({size: "A4", margin: 50});
    //Configurar respuesta para descarga
    res.setHeader('Content-Type', 'application/pdf');
    //Usar el código de la cotización como nombre del archivo
    res.setHeader('Content-Disposition', `attachment; filename=${quote.quoteCode}.pdf`);
    //Enviar PDF al cliente
    doc.pipe(res);
    //Encabezado de la empresa
    doc.fontSize(18).text('MI ESPACIO architecture studio', {align: 'center'});
    doc.fontSize(18).text('NIT: 123456789 | Bogotá, Colombia | carlos.andres22@hotmal.es', {align: 'center'});
    //Separador
    doc.moveDown();
    //Datos de la cotización
    doc.fontSize(12).text(`Cotización: ${quote.quoteCode}`);
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString("es-CO")}`);
    //Si la cotización tiene fecha de vigencia, mostrarla
    if(quote.proposalData.validUntil){
        doc.text(`Vigencia hsta: ${new Date(quote.proposalData.validUntil).toLocaleDateString("es-CO")}`);
    }
    doc.text(`Estado: ${quote.status}`);
    doc.moveDown();
    //Datos del cliente
    doc.fontSize(12).text('Cliente',({underline: true}));
    doc.fontSize(11).text(`${quote.clientSnapshot.name} ${quote.clientSnapshot.lastName}`);
    doc.text(`Email: ${quote.clientSnapshot.email}`);
    doc.moveDown();
    //Detalles del proyecto
    doc.fontSize(12).text('Proyecto', {underline: true});
    doc.fontSize(11).text(`Ubicación: ${quote.location}`);
    doc.text(`Tipo de proyecto: ${quote.projectType}`);
    doc.text(`Servicio específico: ${quote.specificService}`);
    doc.text(`Tiempo estimado: ${quote.estimatedTime}`);
    doc.text(`Presupuesto estimado (referencia): ${money(quote.estimatedBudget)}`);
    if(quote.description)doc.text(`Descripción ${quote.description}`);
    doc.moveDown();
    //Tabla de items de la propuesta
    doc.fontSize(12).text('Detalle de la propuesta', {underline: true});
    doc.moveDown(0.5);
    //Encabezados de la tabla
    const startX = doc.x;
    //Definir columnas
    let y = doc.y;
    //Definir posiciones de columnas
    const colDesc = startX;
    const colQty = startX + 280;
    const colUnit = startX + 340;
    const colTotal = startX + 450;
    //Encabezados
    doc.fontSize(10).text('Descripción', colDesc, y);
    doc.text('Cant.', colQty, y);
    doc.text('V. unit', colUnit, y);
    doc.text('Total', colTotal, y);
    y += 15;
    //Dibujar línea debajo de encabezados
    doc.moveTo(startX, y).lineTo(startX + 500, y).stroke();
    y += 8;
    //Iterar sobre items de la propuesta
    quote.proposalData.items.forEach((it) => {
        doc.fontSize(10).text(String(it.description || ""), colDesc, y,  {width: 270});
        doc.text(String(it.quantity ?? ""), colQty, y);
        doc.text(money(it.unitPrice), colUnit, y);
        doc.text(money(it.total), colTotal, y);
        //Aumentar y para la siguiente fila
        y += 20;
        if(y > 720){
            doc.addPage();
            y = 80;
        }
    });
    //Dibujar línea antes del resumen
    y += 10;
    doc.moveTo(startX, y).lineTo(startX + 500, y).stroke();
    y += 10;
    //Totales
    const subtotal = quote.proposalData.subtotal ?? 0;
    const tax = quote.proposalData.tax ?? 0;
    const total = quote.proposalData.total ?? 0;
    const taxAmount = subtotal * (Number(tax) / 100);
    //Mostrar subtotal, impuesto y total
    doc.fontSize(11).text(`Subtotal: ${money(subtotal)}`, colUnit, y, {align: 'right'});
    y += 15;
    doc.text(`IVA (${tax}%): ${money(taxAmount)}`, colUnit, y, {align: 'right'});
    y += 15;
    doc.fontSize(12).text(`Total: ${money(total)}`, colUnit, y, {align: 'right'});
    y += 25;
    //Notas
    if(quote.proposalData.motes){
        doc.fontSize(10).text("Notas:", startX, y);
        y += 15;
        doc.fontSize(10).text(quote.proposalData.motes, startX, y, {width: 500});
        y += 20;
    }
    //Pie legal
    doc.moveDown(2);
    doc.fontSize(9).text("Esta cotización es una propuesta comercial sujeta a validación técnica y disponibilidad. Los valores pueden variar según alcance final del proyecto.",
    { align: "justify" });
    //Finalizar documento
    doc.end();
});
export const generateProposal = catchAsync(async(req, res)=>{
    const {id} = req.params;
    const quote = await Quote.findById(id);
    if(!quote) throw new AppError("Cotización no encontrada.", 404);
    if(quote.status !== "pendiente" && quote.status !== "en revision"){
        throw new AppError("La propuesta ya fue generada o no puede modificarse.", 400);
    }
    const {items, tax=0, validUntil, notes} = req.body;
    if(!Array.isArray(items) || items.length === 0){
        throw new AppError("La propuesta debe contener al menos un item.", 400);
    }
    let subtotal = 0;
    const normalizedItems = items.map(item => {
        const total = Number(item.quantity)*Number(item.unitPrice);
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
    res.status(200).json({
        message: "Propuesta generada exitosamente.",
        quote
    });
});
export const createQuote = catchAsync(async (req, res) => {
    const userId = req.payload?.id;
    if(!userId) throw new AppError("Usuario no autenticado.", 401);
    const user = await dbGetUserById(userId);
    if(!user || !user.isActive) throw new AppError("Usuario no válido.", 401);
    const { 
        projectType,
        specificService,
        estimatedBudget,
        estimatedTime,
        location,
        description,
        preferredContactMethod
    }= req.body;
    if(!projectType || !specificService || !estimatedBudget || !estimatedTime || !location) throw new AppError("Faltan datos de consulta.", 400);
    const newQuote = await dbCreateQuote({
        user: userId,
        clientSnapshot: {
            name: user.name,
            lastName: user.lastName,
            email: user.email
        },
        projectType,
        specificService,
        estimatedBudget,
        location,
        estimatedTime,
        description,
        preferredContactMethod
    });
    res.status(201).json({
        message: "Cotización creada exitosamente.",
        quote: newQuote
    });
});
export const getMyquotes = catchAsync(async (req, res) => {
    const userId = req.payload?.id;
    const quotes = await dbGetQuotesByUser(userId);
    res.status(200).json({
        message: "Cotizaciones obtenidas exitosamente.",
        quotes
    });
});
export const getAllQuotesAdmin = catchAsync(async (req, res) => {
    const quotes = await dbGetAllQuotes();
    res.status(200).json({
        message: "todas las cotizaciones.",
        quotes
    });
});

export const updateQuoteAdmin = catchAsync(async (req, res) => {
    const {id} = req.params;
    const allowed = ["status","preferredContactMethod","description"];
    const updates = {};
    for(const key of allowed){
        if(req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if(Object.keys(updates).length === 0) {
        throw new AppError("No se proporcionaron campos válidos para actualizar.", 400);
    }
    const updated = await dbUpdateQuoteById(id, updates);
    if(!updated) throw new AppError("Cotización no encontrada.", 404);
      res.status(200).json({
        message: "Cotización actualizada exitosamente.",
        quote: updated
      });
});
export const archiveQuoteAdmin = catchAsync(async (req, res) => {
    const {id} = req.params;
    const updated = await dbUpdateQuoteById(id, {status: "archivada", isDelete: true});
    if(!updated) throw new AppError("Cotización no encontrada.", 404);
     res.status(200).json({
        message: "Cotización archivada exitosamente."
    });
});