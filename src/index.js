import express from 'express';

import dbconection from './config/mongo.config.js';
import userRoutes from './routes/users.route.js';
import productRoutes from './routes/products.route.js';
import healthRoutes from './routes/health.route.js';
import serviceRoutes from './routes/services.routes.js';
import projectRoutes from './routes/projects.routes.js'

const app = express();
const PORT=3000;
dbconection();

app.use(express.json());


app.use(express.json());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/projects', projectRoutes)


app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});
