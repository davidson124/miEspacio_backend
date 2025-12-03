import userModel from "../models/User.model.js"

const dbregisterUser = async ( newUser ) =>{
     return await userModel.create( newUser );
}
// Se debe encargar sólo de la comunicación con la Db
const dbGetAllUsers = async (  ) =>{
     return await userModel.find(  );
}

export {
    dbregisterUser,
    dbGetAllUsers
}