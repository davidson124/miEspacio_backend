import Services from "../models/service.model.js";

export const dbCreateService= async (data)=>{
    return Services.create(data);
};
export const dbGetPublicServices = async() =>{
    return Services.find({ isActive:true }).sort({ order:1, createdAt: -1 });
};
export const dbGetAllServices= async ()=>{
    return Services.find().sort({ order:1, createdAt: -1 });
};
export const dbGetServiceById= async (id)=>{
    return Services.findById(id);
};
export const dbUpdateServiceById = async (id, updates)=>{
    return Services.findByIdAndUpdate(id, updates,{ new: true, runValidators:true });
};
export const dbSoftDeleteServiceById= async (id)=>{
    return Services.findByIdAndUpdate(id, { isActive:false },{ new: true });
};
