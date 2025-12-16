import billingModel from '../models/Billing.model.js';
import { dbBillingRegistered, dbgetAllBilling, dbgetBillingById } from '../services/billing.service.js'


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
    }
     

}
export {
    createBilling,
    getAllBilling,
    getBillingById
}