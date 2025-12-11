import jwt from 'jsonwebtoken';

const generateToken =( payload )=>{

    const token =  jwt.sign(
        payload, //carga util

        'pepe3000', //semilla (palabra secreta)

        { expiresIn: '1h' } //Opciones de configuracióm
    )

    return token;
}


export{
    generateToken
}