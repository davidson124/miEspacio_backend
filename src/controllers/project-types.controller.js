import { dbGetAllProjectTypes,dbCreateProjectType } from "../services/project-types.service.js";

export const getAllProjectTypes = async (req, res) => {
    try {
      const projectTypes = await dbGetAllProjectTypes();
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

    export const createProjectTypes = async (req, res) => {
        const inputData = req.body;

    try {
      const projectTypes = await dbCreateProjectType(inputData);
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