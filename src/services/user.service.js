import userModel from '../models/user.model.js';
// Se debe encargar sólo de la comunicación con la Db
const dbRegisterUser = async (newUser) => { 
     return await userModel.create(newUser);
}
const dbGetAllUsers = async () => { 
     return await userModel.find(); 
}
const dbGetUserById = async (_id) => { 
     return await userModel.findById(_id); 
}
const dbGetUserByEmail = async (email) => {
   return await userModel.findOne({ email });
};
const dbGetUserByEmailWithPassword = async (email) => {
     return await userModel.findOne({ email }).select('+password'); 
}
const dbDeleteUserById = async (_id) => { 
     return await userModel.findOneAndDelete(_id);
}
const dbUpdateUserById = async (_id, inputData) => { 
     return await userModel.findByIdAndUpdate( _id, inputData, { new: true, runValidators: true } );
};
export { dbRegisterUser, dbGetAllUsers, dbGetUserById, dbDeleteUserById, dbUpdateUserById,dbGetUserByEmailWithPassword, dbGetUserByEmail }