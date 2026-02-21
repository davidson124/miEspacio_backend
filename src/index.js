import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import dbconection from './config/mongo.config.js';
import createAdminIfNotExist from './config/bootstrap.js';

import userRoutes from './routes/users.route.js';
import billingRoutes from './routes/billing.route.js';
import documentationsRoutes from './routes/documentations.route.js';
import quotesRoutes from './routes/quote.route.js';
import projectTypesRoutes from './routes/project-types.route.js';
import serviceRoutes from './routes/services.routes.js';
import projectRoutes from './routes/projects.routes.js';
import authRoute from "./routes/auth.route.js";

const app = express();
const PORT= process.env.PORT || 3000;

app.use(express.json());

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/billing', billingRoutes);
app.use('/api/v1/documentations', documentationsRoutes);
app.use('/api/v1/quotes', quotesRoutes);
app.use('/api/v1/project-types', projectTypesRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/projects', projectRoutes)

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


