import bcrypt from 'bcrypt'

// Encriptar Contrasenia 

const encryptedPassword = async (passwordUser)=>{
    const salt = await bcrypt.genSalt(1);

    //Combinar la clave del usuario, con el salt
    const hashPassword = await bcrypt.hash(
        passwordUser,
        salt
    );

    return hashPassword
};

//Verificar la Contrasenia

const verifyEncriptedPassword= async (originalPassword, hashPassword)=>{
    return await bcrypt.compare(
        originalPassword,       // Password Original ->Body
        hashPassword            // Password Base de datos (hashpassword)
    )
}


export {
    encryptedPassword,
    verifyEncriptedPassword

}