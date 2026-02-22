import { verifyToken } from "../helpers/jwt.heplper.js";
const authenticationUser = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            return res.status(401).json({ message: "Token requerido" });
        }
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Formato de token inválido" });
        }
        const token = authHeader.split(" ")[1];
        const payload = verifyToken(token);
        req.payload = payload;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido" });
    }
};
export default authenticationUser;