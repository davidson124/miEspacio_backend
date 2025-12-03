import userModel from "../models/User.model.js"

const dbregisterUser = async ( newUser ) =>{
     return await userModel.create( newUser );
}
// Se debe encargar sólo de la comunicación con la Db
const dbGetAllUsers = async (  ) =>{
     return await userModel.find(  );
}
const dbGetAllUserById = async ( _id )=>{
     return await userModel.findOne( {_id} );
}
export {
    dbregisterUser,
    dbGetAllUsers,
    dbGetAllUserById
}