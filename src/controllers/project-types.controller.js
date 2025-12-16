import { dbGetAllProjectTypes } from "../services/project-types.service.js";

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