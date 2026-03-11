import Quote from "../models/quote.model.js";

export const dbCreateQuote = async (newQuote) => { return Quote.create(newQuote);}
//Obtener cotizaciones, filtro por usuario
export const dbGetQuotesByUser = async (userId) => {
  return Quote.find({ user: userId, isDeleted: false }).sort({ createdAt: -1 }).populate("service", "title");
};
//Obtener cotizaciones, filtro por status
export const dbGetAllQuotes = async (filter = {}) => {
  return Quote.find({ isDeleted: false, ...filter }).sort({ createdAt: -1 }).populate("service", "title").populate("user", "name lastName email");
};
export const dbGetQuoteById = async (id) => {
  return Quote.findById(id).populate("service", "title").populate("project");
};
export const dbUpdateQuoteById = async (id, updates) => {
  return Quote.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
};
