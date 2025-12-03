import mongoose from 'mongoose';

const MONGO_URI = 'mongodb://localhost:27017/bd-miEspacio';

const dbconection = async ()=>{
    try{
        await mongoose.connect(MONGO_URI, {});
        console.log('👌 Conexión exitosa 👌');
    }catch(error){
        console.error('⚠️ error al inicar la base de datos ⚠️');
    };
}
export default dbconection;

