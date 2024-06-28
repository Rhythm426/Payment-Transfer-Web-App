
const express= require("express")
const zod= require("zod")
const jwt= require("jsonwebtoken")
const {JWT_SECRET} = require("../config")
const { User, Account } = require("../dB")
const {authMiddleware}= require("../middleware")


const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    secondName: zod.string(),
    password: zod.string(),
}) 

const updateBody= zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

const signinBody = zod.object({
    username: zod.string(),
    password: zod.string(),
})

const router= express.Router();

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [ 
            {firstName: {"$regex": filter}}, 
            {lastName: {"$regex": filter}}
        ]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName:  user.firstName ,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

router.put("/", authMiddleware, async (req, res)=>{

    const success = updateBody.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message: "invalid inputs"
        })
    }

    await User.updateOne({
        _id: req.userId
    }, req.body)

    return res.json({
        message: "Update Successful"
    })
})


router.post("/signup" , async (req, res)=>{

    const success = signupBody.safeParse(req.body);

    if(!success){
        return res.status(411).json({
            message: "invalid inputs"
        })
    }

    const existingUser= await User.findOne({
        username: req.body.username
    })

    if(existingUser){
        return res.status(411).json({
            message: "email already taken"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })

    const userId= user._id

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    const token= jwt.sign({
        userId
    }, JWT_SECRET);

    res.status(200).json({
        message: "User created successfully",
        token: token
    })
})

router.post("/signin" , async (req, res)=>{

    const {success} = signinBody.safeParse(req.body)

    if(!success){
        return res.status(411).json({
            message: "invalid inputs"
        })
    }

    const existingUser= await User.findOne({
        username: req.body.username
    })

    if(existingUser){
        const token= jwt.sign({
            userId: existingUser._id
        }, JWT_SECRET)

        return res.status(200).json({
            token: token
        })
    }

    return res.status(411).json({
        message: "Error while logging in"
    })

})



module.exports= router 