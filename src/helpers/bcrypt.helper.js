import bcrypt from 'bcrypt'

// Encriptar Contrasenia 

const encryptedPassword = async (passwordUser)=>{
    try {
        const salt = await bcrypt.genSalt(1);
    
        //Combinar la clave del usuario, con el salt
        const hashPassword = await bcrypt.hash(
            passwordUser,
            salt
        );
    
        return hashPassword
        
    } catch (error) {
        console.error(error)
    }

};

//Verificar la Contrasenia

const verifyEncriptedPassword= async (originalPassword, hashPassword)=>{
    try {
        return await bcrypt.compare(
            originalPassword,       // Password Original ->Body
            hashPassword            // Password Base de datos (hashpassword)
        )
        
    } catch (error) {
        console.error(error)        
    }

}


export {
    encryptedPassword,
    verifyEncriptedPassword

}