import "dotenv/config";
import app from './app.js'; 
import dbconection from './config/mongo.config.js';
import createAdminIfNotExist from './config/bootstrap.js';

const PORT = process.env.PORT || 3000;

const starServer = async () => {
  try{
    await dbconection();
    await createAdminIfNotExist();
    app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});
  }catch(error){
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};
starServer();