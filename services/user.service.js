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
const dbDeleteUserById = async ( _id ) =>{
     return await userModel.findOneAndDelete( { _id } );
}
export {
    dbregisterUser,
    dbGetAllUsers,
    dbGetAllUserById,
    dbDeleteUserById
}