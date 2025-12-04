import serviceModel from "../models/service.model.js";

const dbCreateService= async (data)=>{
    return await serviceModel.create(data)
}

const dbGetAllServices= async ()=>{
    return await serviceModel.find()
}

const dbGetServiceById= async (_id)=>{
    return await serviceModel.findById(_id)
}

const dbDeleteService= async (_id)=>{
    return await serviceModel.deleteOne({_id})
}

const dbUpdateService= async (_id, inputData)=>{
    return await serviceModel.findOneAndUpdate({_id}, inputData, {new: true})
}


export {
    dbCreateService,
    dbGetAllServices,
    dbGetServiceById,
    dbDeleteService,
    dbUpdateService

}