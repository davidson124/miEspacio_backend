const mongoose = require('mongoose');
const MONGO_URI = 'mongodb://localhost:27017/bd-miEspacio';

const dbconction = async ()=>{
    try{
        await mongoose.connect(('MONGO_URI'), {});
        console.log('👌 Conección exitosa 👌');
    }catch(error){
        console.error('⚠️ error al inicar la base de datos⚠️');
    };
}
module.exports=dbconction;

