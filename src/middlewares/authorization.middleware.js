const isAdmin = (req, res, next) => {
    if(!req.payload) {
        return res.status(401).json({ message: 'No autorizado.' });
    }
    if(req.payload.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado. Solo administradores pueden acceder.' });
    }
    next();
};
export default isAdmin;