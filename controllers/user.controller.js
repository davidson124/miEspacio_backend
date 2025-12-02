import { registerUser } from "../services/user.service.js";


const createUser = async (req, res )=>{
    const data = req.body;

    const dataRegistered = await registerUser( data ); //regitrar detos de la DB

    res.json({msg: 'crear un objeto', dataRegistered});
};


export {createUser};