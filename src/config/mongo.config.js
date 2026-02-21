import mongoose from 'mongoose';
//  || 'mongodb://localhost:27017/MiEspacio-default';
const MONGO_URI = process.env.DB_URI;
if(!MONGO_URI){
    console.error('Error: variable DB_URI no está definida.');
    process.exit(1);
}
const dbconection = async ()=>{
    try{
        await mongoose.connect(MONGO_URI);
        console.log('Base de datos conectada exitosamente.');
    }catch(error){
        console.error('Error conectando a MongoDB: ',error.message);
        process.exit(1);
    };
};
export default dbconection;
