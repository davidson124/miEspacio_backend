import express from 'express';

import dbconection from './config/mongo.config.js';
import userRoutes from './routes/users.route.js';
import productRoutes from './routes/products.route.js';
import healthRoutes from './routes/health.route.js';
import authRouter from './routes/auth.route.js'
import billingRoutes from './routes/billing.route.js';
import documentationsRoutes from './routes/documentations.route.js';
import quotesRoutes from './routes/quote.route.js';
import projectTypesRoutes from './routes/project-types.route.js';

const app = express();
const PORT=process.env.PORT;

dbconection();

app.use(express.json());

app.use('/api/v1/auth.route.js', authRouter);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/billing', billingRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/documentations', documentationsRoutes);
app.use('/api/v1/quotes', quotesRoutes);
app.use('/api/v1/project-types', projectTypesRoutes);



app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});
