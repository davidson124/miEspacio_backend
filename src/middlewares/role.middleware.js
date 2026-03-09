import AppError from "../utils/AppError.js";

export const isAdminOrArchitect = (req, res, next) => {
  if (!req.payload) return next(new AppError("No autorizado.", 401));
  const { role } = req.payload;
  if (!["admin", "architect"].includes(role)) {
    return next(new AppError("Acceso denegado.", 403));
  }
  next();
};