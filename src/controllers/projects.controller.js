import { dbCreateProject, dbDeleteProject, dbGetAllProjects, dbGetProjectById, dbUpdateProject } from "../services/projects.services.js";

const createProject = async (req,res)=>{
    try {
        const projectInput=req.body;
    
        const project= await dbCreateProject(projectInput);
    
        res.json({
            message:`Project successfullu created`,
            project
        })
        
    } catch (error) {
        console.error(error),
        res.json({
            message:`Project could not be created, please try again`,
        })
    }
};

const getAllProjects = async (req,res)=>{
    try {
        const project = await dbGetAllProjects();
    
        res.json({
            message: `Projects successfully brought`,
            project
        })
        
    } catch (error) {
        console.error(error)
        res.json({
            message: `Projects were not found, please try again`
        })
        
    }
    

};

const getProjectById = async (req,res)=>{
    try {

        const projectData = req.params.idProject

        const project = await dbGetProjectById(projectData);

        res.json({
            message: `Project successfully brought`,
            project
        })
        
    } catch (error) {
        console.error(error),
        res.json({
            message:`There was an error finding your project, please try again`
        })
    }
};

const deleteProject = async (req,res)=>{

    try {
        const projectData=req.params.idProject;
    
        const project= await dbDeleteProject(projectData)
    
        res.json({
            message: `Project deleted`,
            project
        })
        
    } catch (error) {
        console.error(error),
        res.json({
            message: `Project could not be deleted, please try again`
        })

        
    }

};

const updateProject = async (req,res)=>{
    try {
        const projectData=req.params.idProject
    
        const projectInput=req.body
    
        const project = await dbUpdateProject(projectData, projectInput);
    
        res.json({
            message:`Project successfully updated`,
            project
        })
        
    } catch (error) {
        console.error(error),
        res.json({
            message:`Project could not be updated, please try again`
        })
        
    }

}




export {createProject,
        getAllProjects,
        getProjectById,
        deleteProject,
        updateProject
}