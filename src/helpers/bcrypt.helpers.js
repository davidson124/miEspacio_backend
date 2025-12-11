import bcrypt from 'bcrypt';

//encriptar contraseña
const encryptedPassword =(passwordUser)=>{
    const salt = bcrypt.genSaltSync(3); //Generar una cadena aleatoria

    console.log(salt);

    const hashPassword = bcrypt.hashSync(
        passwordUser,
        salt
    );

    return hashPassword; //Devuelve la contraseña encriptada
}

// verificar contraseña
const verifyEncriptedPassword = (originalPassword, hashPassword) => {
    console.log(bcrypt.compareSync( originalPassword, hashPassword ));

    return bcrypt.compareSync( originalPassword, hashPassword );
}


export{
    encryptedPassword,
    verifyEncriptedPassword
}