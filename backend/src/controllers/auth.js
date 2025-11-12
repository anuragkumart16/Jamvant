import asyncHandler  from "../utils/asyncHandler.js";
import prisma from "../utils/prisma.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

export const signup = asyncHandler(async(req,res)=>{
    const body = req.body

    const email = body?.email
    const password = body?.password

    if(!email || !password){
        return res.status(400).json({
            message:"Please provide email and password",
            success:false,
            status:400
        })
    }

    if(!email.includes("@")){
        return res.status(400).json({
            message:"Please provide valid email",
            success:false,
            status:400
        })
    }

    if(password.length < 6){
        return res.status(400).json({
            message:"Password must be at least 6 characters",
            success:false,
            status:400
        })
    }

    const alreadyExists = await prisma.User.findUnique({
        where : {
            email : email
        }
    })

    if(alreadyExists){
        return res.status(400).json({
            message:"User already exists",
            success:false,
            status:400
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.User.create({
        data : {
            email : email,
            password : hashedPassword
        },
        select:{
            id : true,
            email : true
        }
    })

    const token = await jwt.sign({
        id : user.id
    }, process.env.JWT_SECRET)

    return res.status(200)
        .cookie("token", token, {
            httpOnly : true,
            sameSite : process.env.SAME_SITE || "none",
            secure : process.env.COOKIE_SECURE || true
        })
        .json({
        message:"User created successfully",
        success:true,
        status:200,
        data: user,
        token
    })

})

export const login = asyncHandler(async(req,res)=>{
    const body = req.body

    const email = body?.email
    const password = body?.password

    if(!email || !password){
        return res.status(400).json({
            message:"Please provide email and password",
            success:false,
            status:400
        })   
    }

    if(!email.includes("@")){
        return res.status(400).json({
            message:"Please provide valid email",
            success:false,
            status:400
        })
    }

    if (password.length < 6){
        return res.status(400).json({
            message:"Password must be at least 6 characters",
            success:false,
            status:400
        })
    }

    const user = await prisma.User.findUnique({
        where : {
            email : email
        }
    })

    if(!user){
        return res.status(400).json({
            message:"User not found",
            success:false,
            status:400
        })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if(!isPasswordCorrect){
        return res.status(400).json({
            message:"Incorrect password",
            success:false,
            status:400
        })
    }

    const token = await jwt.sign({
        id : user.id
    }, process.env.JWT_SECRET)

    return res.status(200)
        .cookie("token", token, {
            httpOnly : true,
            sameSite : process.env.SAME_SITE || "none",
            secure : process.env.COOKIE_SECURE || true
        })
        .json({
        message:"User logged in successfully",
        success:true,
        status:200,
        data: user,
        token
    })
})

export const checkEmail = asyncHandler(async(req,res)=>{
    const email = req.body?.email

    if(!email){
        return res.status(400).json({
            message:"Please provide email",
            success:false,
            status:400
        }) 
    }

    const user = await prisma.User.findUnique({
        where : {
            email : email
        }
    })

    if (user) {
        return res.status(400).json({
            message:"Email already exists",
            success:false,
            status:400
        })
    }

    return res.status(200).json({
        message:"Email available",
        success:true,
        status:200,
        data: user
    })
})