import bycript from 'bcrypt';
import User from '../models/user.model.js';
const createAdminIfNotExists = async () => {
    const adminExists = await User.findOne({ role: 'admin' });
    if(adminExists){
        console.log('Ya existe un administrador.');
        return;
    }
    if(!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD){
        console.error('Credenciales no definidas.');
        process.exit(1);
    }
    const hashedPassword = await bycript.hash(process.env.ADMIN_PASSWORD, 10);
    await User.create({
        name: 'Admin',
        lastName: 'User',
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        cellphoneNumber: '0000000000',
        role: 'admin'
    });
    console.log('Administrador creado exitosamente.');
}
export default createAdminIfNotExists;