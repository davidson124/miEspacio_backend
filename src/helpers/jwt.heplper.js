import jwt from 'jsonwebtoken';

const generateToken = (payload) => {
    try {
        const token=jwt.sign(
            payload,            //Carga Util
            "pepe3000",         //Semilla(Palabra Secreta) ==> Salt
            {expiresIn: '1h'}   //Opciones de configuracion del Token
        )
        return token
        
    } catch (error) {
        console.error(error)
    }
    
}

const verifyToken=(token)=>{
    try {
        return jwt.verify(
            token,          // Token Valido
            process.env.JWT_SEED,     // Clave
        )
        
    } catch (error) {
        console.error(error)
    }

}

export {
    generateToken,
    verifyToken
}