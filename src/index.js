import express from 'express';
import dbconection from './config/mongo.config.js';
import userRoutes from './routes/users.route.js';
import productRoutes from './routes/products.route.js';
import healthRoutes from './routes/health.route.js';
import authRouther from './routes/auth.route.js'

const app = express();
const PORT=process.env.PORT;
dbconection();

app.use(express.json());

app.use('/api/v1/auth', authRouther);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/products', productRoutes);


app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});
