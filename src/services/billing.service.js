import billingModel from "../models/Billing.model.js";

const dbBillingRegistered = async (newBill)=>{
    return await  billingModel.create(newBill);
}
const dbgetAllBilling = async ()=>{
    return await billingModel.find( );
}
const dbgetBillingById = async ( _id )=>{
    return await billingModel.findById( _id );
}
const dbDeletebillingById = async (_id)=>{
    return await billingModel.findOneAndDelete({_id});
}
const dbUpDatebillingById = async (_id)=>{
    return await billingModel.findOneAndUpdate({_id})
}
export {
    dbBillingRegistered,
    dbgetAllBilling,
    dbgetBillingById,
    dbDeletebillingById,
    dbUpDatebillingById
    
}