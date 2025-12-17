import projectTypeModel from "../models/project-types.model.js";

const dbGetAllProjectTypes = async () =>{
    return await projectTypeModel.find();
}

const dbCreateProjectType = async (newProjectType) => {
    return await projectTypeModel.create(newProjectType);
        
}

const dbpatchProjectTypes = async (newProjectType, _id) =>{
    return await projectTypeModel.findByIdAndUpdate(_id, newProjectType, {new:true})
}
const dbdeleteProjectTypes = async (_id) =>{
    return await projectTypeModel.findOneAndDelete({_id})
}


export{
    dbGetAllProjectTypes,
    dbCreateProjectType,
    dbpatchProjectTypes,
    dbdeleteProjectTypes,
    

}