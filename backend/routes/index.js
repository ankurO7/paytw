const express = require('express');
const userRouter = require("./user");
const zod = require('zod');
const { User } = require("../db");

const bcrypt = require("bcrypt")
const { JWT_SECRET } = require("../config");

const router = express.Router(); // all requests starts from /api/v1

router.use("/user", userRouter);


const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
})

// routes are handled here.

router.post("/signup", async(req,res) => {
    const { success } = signupBody.safeParse(req.body)
    if(!success) {
        return res.status(411).json({
            message: "Email already taken/ Incorrect inputs"
        })
    }

    const existUser = await User.findOne({
        username: req.body.username
    })

    if(existUser){
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    })

    const userId = user._id;

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })
})

module.exports = router;