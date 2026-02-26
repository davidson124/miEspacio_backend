import Quote from "../models/quote.model.js";

export const dbGetAllQuotes = async () =>{
    return await Quote.find({ isDeleted: false }).sort({ createdAt: -1 });
};
export const dbGetQuotesByUser  = async (userId) => {
    return await Quote.find({ user: userId, isDeleted: false }).sort({ createdAt: -1 });   
};
export const dbCreateQuote = async (newQuote) => {
    return await Quote.create(newQuote);
};
export const dbUpdateQuoteById = async (id, updates) => {
  return await Quote.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
};
