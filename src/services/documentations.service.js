import documentationsModel from '../models/documentations.model.js'
const dbDocumentationsRegistered = async (newDocumentatios)=>{
    return await documentationsModel.create(newDocumentatios);
}
const dbGetAllDocumentations = async () =>{
    return await documentationsModel.find();
}
const dbGetDocumentatiosById = async (_id) =>{
    return await documentationsModel.findById({_id});
}
const dbDeleteDocumentationsById = async (_id)=>{
    return await documentationsModel.findOneAndDelete({_id});
}
const dbUpDateDocumentationsById = async({_id})=>{
    return await documentationsModel.findOneAndUpdate({_id});
}


export {
    dbDocumentationsRegistered,
    dbGetAllDocumentations,
    dbGetDocumentatiosById,
    dbDeleteDocumentationsById,
    dbUpDateDocumentationsById
}