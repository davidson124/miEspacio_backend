import jwt from 'jsonwebtoken';

const generateToken =( payload )=>{

    const token =  jwt.sign(
        payload, //carga util

        process.env.JWT_SEED, //semilla (palabra secreta)

        { expiresIn: '1h' } //Opciones de configuracióm
    )

    return token;
}
const verifyToken = ( token )=>{
    return jwt.verify(
        token, //token valido
        process.env.JWT_SEED, //semilla (palabra secreta)

    )
}




export{
    generateToken,
    verifyToken
}