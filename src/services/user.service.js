import userModel from "../models/User.model.js"
// Se debe encargar sólo de la comunicación con la Db
const dbregisterUser = async ( newUser ) =>{
     return await userModel.create( newUser );
}
const dbGetAllUsers = async (  ) =>{
     return await userModel.find(  );
}
const dbGetAllUserById = async ( _id )=>{
     return await userModel.findOne( {_id} );
}
const dbDeleteUserById = async ( _id ) =>{
     return await userModel.findOneAndDelete( { _id } );
}
const dbupDateUserById = async ( _id, inputData ) =>{
     return await userModel.findByIdAndUpdate( { _id }, inputData, { new: true} );
}
export {
    dbregisterUser,
    dbGetAllUsers,
    dbGetAllUserById,
    dbDeleteUserById,
    dbupDateUserById
}