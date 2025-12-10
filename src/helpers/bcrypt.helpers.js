import bcrypt from 'bcrypt';

//encriptar contraseña
const encryptedPassword =(passwordUser)=>{
    const salt = bcrypt.genSaltSync(); //Generar una cadena aleatoria

    console.log(salt);

    const hashPassword = bcrypt.hashSync(
        passwordUser,
        salt
    );

    return hashPassword; //Devuelve la contraseña encriptada
}

// verificar contraseña
const verifyEncriptedPassword =()=>{
    
}


export{
    encryptedPassword,
    verifyEncriptedPassword
}