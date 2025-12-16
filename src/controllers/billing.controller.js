import billingModel from '../models/Billing.model.js';
import { dbBillingRegistered, dbDeletebillingById, dbgetAllBilling, dbgetBillingById, dbUpDatebillingById } from '../services/billing.service.js'


const createBilling = async (req, res)=>{
    const inputData = req.body;
    try{
        const  billingRegistered = await dbBillingRegistered(inputData);
        res.json({msg:' 🆗 FACTURA CREADA CORRECTAMENTE 🆗 ',billingRegistered});
    }catch(error){
         res.json({msg:' 🆗 NO SE PUDO CREAR CORRECTAMENTE 🆗 '});
    }       
        
}
const getAllBilling = async ( req, res )=>{
    try{
        const billing = await dbgetAllBilling();
        res.json({msg:'🕑 BUSCANDO FACTURAS... ',billing});
    }catch(error){
        res.json({msg:'⚠️ ⛔ NO SE ENCUENTRA RESULATDOS DE LAS FACTURAS ⛔ ⚠️'});
    } 
}
const getBillingById = async ( req, res ) => {
    try{
        const id = req.params.id;
        const billFound = await dbgetBillingById(id);
        res.json({msg:'🕑 BUSCANDO FACTURA... ',billFound});
    }catch(error){
         res.json({
            msg:'⚠️ ⛔ USUARIO NO ENCINTRADO ⛔ ⚠️'
         });
    };
}
const deletebillingById = async ( req, res )=>{
    try{
        const id = req.paramas.id;
        const deleteBilling = await dbDeletebillingById(id);
        res.json({msg:'La factura se eliminó exitosamente'});
    }catch(error){
        res.json({msg:'No se pudo eliminar la factura'});
    }
}
const upDatebillingById = async ( req, res )=>{
    try{
        const imputData = req.body;
        const id = req.paramas.id;
        const updateBilling = await dbUpDatebillingById(id);
        res.json({msg:'Cabiamos los datos de la factura exitosamente'});
    }catch(error){
        res.json({msg:'No se pudo modificar datos de la factura '});
    }
}
export {
    createBilling,
    getAllBilling,
    getBillingById,
    deletebillingById,
    upDatebillingById
}