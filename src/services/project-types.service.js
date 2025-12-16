import projectTypeModel from "../models/project-types.model.js";


export const dbGetAllProjectTypes = async () =>{
    return await projectTypeModel.find();
}

export const dbCreateProjectType = async (newProjectType) => {
    return await projectTypeModel.create(newProjectType);
        
}