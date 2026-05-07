const express = require('express');
const zod = require('zod');
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../config');

const router = express.Router();

// signup and sign in routes

const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string() 
})

// sign up
router.post("/signup", (req,res) => {
    
    const body = req.body;

    const { success } = signupSchema.safeParse(req.body);

    if(!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = User.findOne({
        username: body.username
    })

    if(user._id){
        return res.status(411).json({
            message: "Email already taken / Incorrect Inputs"
        })
    }
    
    const dbUser = await User.create(body);
    
    const userId = user._id;
    // Create a new Account

    await Account.create({
        userId,
        balance: 1+Math.random()*10000
    })
    const token = jwt.sign({
        userId: dbUser._id
    },JWT_SECRET)

    res.json({
        message: "User created successfully",
        token: token
    })

    
    
})


const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string().minLength(8)
})

// login
router.post("/signin", async (req,res) => {
    const {success} = signinBody.safeParse(req.body)
    if(!success) {
        return res.status(411).json({
            message: "Email already taken / incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if(user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        res.json({
            token: token
        })
        return;
    }

    res.status(411).json({
        message: "Error while logging in"
    })
})

// route to update user information

const { authMiddleware} = require("../middleware");

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/",authMiddleware, async (req,res) => {
    const {success} = updateBody.safeParse(req.body);
    if(!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }
    await User.updateOne({ _id: req.userId}, req.body);

    res.json({
        message: "Updated successfully"
    })
})

// route to get Users from backend, filterable using name

router.get("/bulk", async (req,res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })
    

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router;