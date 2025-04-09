import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { Condiment } from "next/font/google";

export async function POST(request: Request) {
    await dbConnect()

    try {

        const { username, email, password } = await request.json()

        const existingUserVerifiedByusername = await userModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserVerifiedByusername) {
            return Response.json({
                success: false,
                message: "Username already is there"
            }, { status: 400 })
        }

        const existingUserByEmail = await userModel.findOne({ email })
        
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if (existingUserByEmail) {
            true // TODO: Back here
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new userModel({
                username,
                email,
                password: hashedPassword,
                verifyCode, 
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save()
        }

        //send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

    } catch (error) {
        console.error('Error registering user', error)
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        )
    }
}
