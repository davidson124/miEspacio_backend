import User from '../models/user.model.js';
// Se debe encargar sólo de la comunicación con la Db
const dbRegisterUser = async (newUser) => { 
     return await User.create(newUser);
}
const dbGetAllUsers = async () => { 
     return await User.find(); 
}
const dbGetUserById = async (_id) => { 
     return await User.findById(_id); 
}
const dbGetUserByEmail = async (email) => {
   return await User.findOne({ email });
};
const dbGetUserByEmailWithPassword = async (email) => {
     return await User.findOne({ email }).select('+password'); 
}
const dbDeleteUserById = async (_id) => { 
     return await User.findOneAndDelete(_id);
}
const dbUpdateUserById = async (_id, inputData) => { 
     return await User.findByIdAndUpdate( _id, inputData, { new: true, runValidators: true } );
};
export { dbRegisterUser, dbGetAllUsers, dbGetUserById, dbDeleteUserById, dbUpdateUserById,dbGetUserByEmailWithPassword, dbGetUserByEmail }