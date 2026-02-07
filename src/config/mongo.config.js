import mongoose from 'mongoose';

const MONGO_URI = process.env.DB_URI || 'mongodb://localhost:27017/MiEspacio-default';


const dbconection = async ()=>{
    try{
        await mongoose.connect(MONGO_URI, {});
        console.log('👌 Conexión exitosa 👌');
    }catch(error){
        console.error('⚠️ error al inicar la base de datos ⚠️');
    };
}
export default dbconection;
