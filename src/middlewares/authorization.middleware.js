import AppError from "../utils/appError.js";
const isAdmin = (req, res, next) => {
    if(!req.payload) {
        return next(new AppError('No autorizado.', 401));
    }
    if(req.payload.role !== 'admin') {
        return next(new AppError('Acceso denegado. Solo administradores pueden acceder.', 403));
    }
    next();
};
export default isAdmin;