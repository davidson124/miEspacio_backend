import Service from "../models/service.model.js";

export const dbCreateService= async (data)=>{
    return Service.create(data);
};
export const dbGetPublicServices = async() =>{
    return Service.find({ isActive:true }).sort({ order:1, createdAt: -1 });
};
export const dbGetAllServices= async ()=>{
    return Service.find().sort({ order:1, createdAt: -1 });
};
export const dbGetServiceById= async (id)=>{
    return Service.findById(id);
};
export const dbUpdateServiceById = async (id, updates)=>{
    return Service.findByIdAndUpdate(id, updates,{ new: true, runValidators:true });
};
export const dbSoftDeleteServiceById= async (id)=>{
    return Service.findByIdAndUpdate(id, { isActive:false },{ new: true });
};
