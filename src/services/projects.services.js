import projectModel from "../models/projects.models.js";

const dbCreateProject = async (data)=>{
    return await projectModel.create(data)
}

const dbGetAllProjects = async()=>{
    return await projectModel.find()
}

const dbGetProjectById = async(data)=>{
    return await projectModel.findById(data)
}

const dbDeleteProject = async (data)=>{
    return await projectModel.deleteOne({data})
}

const dbUpdateProject = async (_id, input)=>{
    return await projectModel.findOneAndUpdate({_id},input,{new:true})
}


export {dbCreateProject,
        dbGetAllProjects,
        dbGetProjectById,
        dbDeleteProject,
        dbUpdateProject
}