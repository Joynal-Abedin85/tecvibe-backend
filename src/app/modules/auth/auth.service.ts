import prisma from "../../utils/prisma"
import bcrypt from "bcryptjs";
import jwt  from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const register = async (payload: any) => {
    const {name,email,password,confirmPassword} = payload

      if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

    const existinguser = await prisma.user.findUnique({where: {email: payload.email}})

    if (existinguser) {
        throw new Error("already user exist")
    }

    const hashpass = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashpass,
        }
    })

    return user
    
}

const login = async(payload: any) => {
    const {email, password} = payload

    const user = await prisma.user.findUnique({where: {email: email}})
    if(!user) throw new Error ("user not found")

    if(!user.password) throw new Error ("try to google login ")

    const ismatch = await bcrypt.compare(password, user.password)
    if(!ismatch) throw new Error ("pass or email not match")

    const token = jwt.sign(
        {id: user.id, role: user.role},
        process.env.JWT_SECRET! as string,
        {expiresIn: "2d"}
    )

    console.log("signed token:", token);
    console.log("decoded:", jwt.verify(token, process.env.JWT_SECRET!));

    return {token,user}
}


const googlelogin = async(token: string) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
    })

    const payload = ticket.getPayload()

    if(!payload) throw new Error ("token is not found")

    const {email, name} = payload

    if(!name || !email){
        throw new Error("all required")
    }

    let user = await prisma.user.findUnique({where: {email}})

    if(!email){
        user = await prisma.user.create({
            data: {
                name,
                email
            }
        })
    }

    
    const jwtToken = jwt.sign(
      { id: user?.id, role: user?.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return { token: jwtToken, user };
}

export const authservice ={
    register,
    login,
    googlelogin
}