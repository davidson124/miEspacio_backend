import jwt from 'jsonwebtoken';

const generateToken = (payload) => {
    const token=jwt.sign(
        payload,            //Carga Util
        "pepe3000",         //Semilla(Palabra Secreta) ==> Salt
        {expiresIn: '1h'}   //Opciones de configuracion del Token
    )
    return token
}

const verifyToken=(token)=>{
    return jwt.verify(
        token,          // Token Valido
        process.env.JWT_SEED,     // Clave
    )
}

export {
    generateToken,
    verifyToken
}