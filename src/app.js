import express from 'express';

import authRoute from "./routes/auth.route.js";
import workRoutes from './routes/works.route.js';
import userRoutes from './routes/users.route.js';
import quotesRoutes from './routes/quote.route.js';
import uploadRoutes from "./routes/upload.route.js";
import projectsRoutes from './routes/projects.route.js';
import serviceRoutes from './routes/services.routes.js';
import errorHandler from './middlewares/error.middleware.js';
import projectDocumentsRoutes from "./routes/projectDocuments.route.js";


const app = express();

app.use(express.json());

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/works', workRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/quotes', quotesRoutes);
app.use("/api/v1/uploads", uploadRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use("/api/v1/projects", projectsRoutes);
app.use('/api/v1/projecs-documents', projectDocumentsRoutes);

app.use(errorHandler);

export default app;