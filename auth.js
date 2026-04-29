import { db } from './dbConnection.js'

async function signUpUser(email, password, fullName) {
    const { data, error } = await db.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                full_name: fullName,
                role: 'renter'
            }
        }
    })

    if (error) console.error("Signup Error:", error.message)
    else console.log("User registered:", data.user)
}