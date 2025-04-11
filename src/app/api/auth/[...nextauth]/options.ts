import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials: any): Promise<any>{
                await dbConnect()
                try {

                    const user = await userModel.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })

                    if(!user){
                        throw new Error('No user found with this email')
                    }

                    if(user.isVerified){
                        throw new Error('please verify your account first')
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if(isPasswordCorrect){
                        return user
                    } else {
                        throw new Error('incorrect password')
                    }
                    
                } catch (error:any) {
                 throw new Error(error) 
                }
              }
        })
    ],
    callbacks: {
        async session({ session, token}) {
            return session
          },
        async jwt({ token, user }) {
            if(user){
                token._id = user._id?.toString()
            }
          }
    },
    pages: {
        signIn: '/sign-in',

    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,

}