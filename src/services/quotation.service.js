import quotationModel from "../models/quotation.model.js";

const dbCreateQuote = async (inputData)=>{
    return await quotationModel.create(inputData)
}

const dbGetQuoteById= async (_id)=>{
    return await quotationModel.findById(_id)
}

const dbGetAllQuotes= async ()=>{
    return await quotationModel.find()
}

const dbUpdateQuote= async (inputData,_id)=>{
    return await quotationModel.findOneAndUpdate({_id},inputData, {new:true})
}

const dbDeleteQuote = async (_id)=>{
    return await quotationModel.findByIdAndDelete(_id)
}

export{
    dbCreateQuote,
    dbDeleteQuote,
    dbGetAllQuotes,
    dbGetQuoteById,
    dbUpdateQuote}

