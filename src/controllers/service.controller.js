import serviceModel from "../models/service.model.js";
import { dbCreateService, dbDeleteService, dbGetAllServices, dbGetServiceById, dbUpdateService } from "../services/services.service.js";

const createService= async function (req,res){
    try {
        const service = req.body;
    
        const serviceResponse = await dbCreateService(service)
    
        res.json({
            message: `Service successfully created`,
            serviceResponse 
    
        })
        
    } catch (error) {
        console.error(error),
        res.json({
            message: `Service could not be created, please try again`
        })
        
        
    }
};
const getAllServices= async function (req,res){
    try {
        const allServices= await dbGetAllServices();
    
        res.json({
            message: `Services successfully brought`,
            allServices
        })
        
    } catch (error) {
        console.error(error)
        res.json({
            message: `Services could not be brought`
        })        
    }


};
const getServiceById = async function(req,res){
    try {
        const serviceData = req.params.serviceId
    
        const service = await dbGetServiceById(serviceData);
    
        res.json({
            message: `Service successfully brought`,
            service
        })
        
    } catch (error) {
        console.error(error),
        res.json({
            message: `Service could not be brought, please try again `
        })        
    }

}
const deleteService = async function (req,res){
    try {
        
        const serviceData= req.params.serviceId
    
        const serviceDeleted= await dbDeleteService(serviceData)
    
        res.json({
            message: `Service successfully deleted`,
            serviceDeleted
        })
        
    } catch (error) {
        console.error(error),
        res.json({
            message: `Service Could not be deleted, please try again`
        })
    }
}
const patchService = async function (req,res){
    try {
        const serviceData= req.params.serviceId
    
        const serviceInput= req.body
    
        const service= await dbUpdateService(serviceData, serviceInput);
    
        console.log(service)
        res.json({
            message: `Service successfully updated`,
            service
        });
        
    } catch (error) {
        console.error(error),
        res.json({
            message: `Service could not be updated`
        })
        
    }

}

export {
    createService,
    getAllServices,
    getServiceById,
    deleteService,
    patchService
}