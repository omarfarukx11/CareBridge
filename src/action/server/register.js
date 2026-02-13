'use server'

import { dbConnect } from "@/lib/dbConnect"
import bcrypt from "bcryptjs"

export const postUser = async (payload) => { 
    const isExist = await dbConnect('users').findOne({email:payload.email});
    if(isExist) {
        return {
            success:false,
            message : "user already existed"
        }
    }
    const hasPassword = await bcrypt.hash(payload.password,10)
    const newUser ={
        ...payload,
        createAt : new Date().toISOString(),
        role:"user",
        password : hasPassword

    }

    const result = await dbConnect('users').insertOne(newUser)
    if(result.acknowledged) {
        return {
            success : true,
            message : `User Created with ${result.insertedId}`
        }
    }else {
        return {
            success : false,
            message : `Something Went Worng.try again`
        }
    }

 }  