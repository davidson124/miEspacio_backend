import { dbDeleteDocumentationsById, dbDocumentationsRegistered, dbGetAllDocumentations, dbGetDocumentatiosById, dbUpDateDocumentationsById } from "../services/documentations.service.js";

const createDocumentations = async (req, res)=>{
    const imputData =req.body;
    try{
        const documentationsRegistered = await dbDocumentationsRegistered(imputData);
        res.json({msg:'Documentación creada correctamente. ',documentationsRegistered});
    }catch(error){
        console.error(error);
        res.json({msg:'Error: no se puede generar la documentación'});
    };
}
const getAllDocumentations = async (req, res)=>{
    try{
        const allDocumentatios = await dbGetAllDocumentations();
        res.json({msg:'Hemos encontrado la documentación',allDocumentatios});
    }catch(error)
    { 
        res.json({msg:'No Hemos encontrado la documentación'});
    };
}
const getDocumentationsById = async ( req, res )=>{
    try{
        const id = req.params.id;
        const documentationFound = await dbGetDocumentatiosById(id);
        res.json({msg:'Encontramos el documento',documentationFound});
    }catch(error){
        res.json({msg:'No se encontró el documento'});
    };
}

const deleteDocumentationById = async ( req, res )=>{
    try{
        const id = req.params.id;
        const deleteDocumentation = await dbDeleteDocumentationsById(id);
        res.json({msg:'Documento eliminado satisfactoriamente'});

    }catch(error){
        res.json({msg:'No se pudo eliminar el documento'});
    };
}
const upDateDocumentation = async ( req, res )=>{
    try{
        const imputData =req.body;
        const id = req.params.id;
        const upDateDocumentation = await dbUpDateDocumentationsById(id);
        res.json({msg:'Los cambios en tu documento se realizaron satisfactoriamente',upDateDocumentation});
    }catch(error){
        res.json({msg:'No se pudo cambiar la información'});
    };
}
export {
    createDocumentations,
    getAllDocumentations,
    getDocumentationsById,
    deleteDocumentationById,
    upDateDocumentation
}