import userModel from "../models/User.model.js"

const registerUser = async ( newUser ) =>{
     return await userModel.create( newUser );
}
// Se debe encargar sólo de la comunicación con la Db


export {
    registerUser
}