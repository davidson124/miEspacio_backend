import jwt from "jsonwebtoken";
//Generar token JWT
export const generateToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET, // ← UNIFICAMOS
    { expiresIn: "1h" }
  );
};
//Verificar token JWT
export const verifyToken = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET // ← UNIFICAMOS
  );
};