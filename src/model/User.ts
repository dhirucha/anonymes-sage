import mongoose, {Schema, Document, models} from "mongoose";
import { deflate } from "zlib";


export interface Message extends Document{
    content: string;
    createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        trim: true,
        unique: true
    },
    email:{
        type: String,
        required: [true, "email is required"],
        unique: true,
        match: [/.+\@.+\..+/
        , 'please use a valid email address']
    },
    password: {
        type: String,
        required: [true, "password is required"],

    },
    verifyCode: {
        type: String,
        required: [true, "Verify is required"],
        
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify code Expiry is required"],
    },
    isVerified: {
        type: Boolean,
        default: false,

    },
    isAcceptingMessage:{
        type: Boolean,
        default: true
    },
    messages: [MessageSchema]
})

const userModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default userModel;