import { dbCreateQuotes, dbGetAllQuotes, dbpatchQuotes , dbdeleteQuotes} from "../services/quote.service.js";


export const getAllQuotes = async (req, res) => {
    try {
    const projectTypes = await dbGetAllQuotes();
    res.json({
        msg: "obtiene los tipos de proyectos",
        projectTypes})
    }
    catch (error){
        console.log(error);
        res.json({
            msg: "ERROR : No se pudo obtener los tipos de proyectos"        
        })
    }}

    export const createQuotes = async (req, res) => {
        const inputData = req.body;

    
        try {
      const projectTypes = await dbCreateQuotes(inputData);
      res.json({
        msg: "crea el tipo de proyecto",
        projectTypes})
    }
    catch (error){
        console.log(error);
        res.json({
            msg: "ERROR : No se pudo crer el tipo de proyecto"        
        })
    }}


    export const patchQuotes= async (req, res) => {
        const inputData = req.body;
        const data = req.params.idProject
        try {
      const projectTypes = await dbpatchQuotes(inputData, data)
      res.json({
        msg: "actualiza el tipo de proyecto",
        projectTypes})
    }
    catch (error){
        console.log(error);
        res.json({
            msg: "ERROR : No se pudo actualizar el tipo de proyecto"        
        })
    }}
     export const deleteQuotes= async (req, res) => {
    try {
        const data = req.params.idProject

    

        const projectTypeDeleted = await dbdeleteQuotes(data)
        res.json({
            msg: "elimina el tipo de proyecto",
            projectTypeDeleted})

        }
    catch (error){
        console.log(error);
        res.json({
            msg: "ERROR : No se pudo eliminar el tipo de proyecto"        
        })
    }}