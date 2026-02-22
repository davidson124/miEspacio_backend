import mongoose from 'mongoose';
const dbconection = async () => {
    const MONGO_URI = process.env.DB_URI;
    if (!MONGO_URI) {
        console.error('Error: DB_URI no está definida en variables de entorno.');
        process.exit(1);
    }
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Base de datos conectada exitosamente.');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error.message);
        process.exit(1);
    }
};
export default dbconection;
