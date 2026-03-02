import Work from '../models/work.model.js';
export const dbCreateWork = async (newWork) => Work.create(newWork);

export const dbGetPublicWorks = async (filter = {})=>{
    return Work.find({ ...filter, isDeleted: false, isPublished:true }).sort({ createdAt: -1});
};
export const dbGetPublicWorkById = async (id)=>{ return Work.findOne({ _id: id, isDeleted:false, isPublished:true}) };

export const dbUpdateWorkById = async (id, updates)=>{ return Work.findByIdAndUpdate(id, updates, {new:true, runValidators:true}); }

export const dbSoftDeleteWorkById = async(id)=>{ return Work.findByIdAndUpdate(id, { isDeleted:true, isPublished:false}, {new:true} ); };