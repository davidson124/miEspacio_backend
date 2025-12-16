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
export {
    dbBillingRegistered,
    dbgetAllBilling,
    dbgetBillingById
}