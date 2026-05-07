const express = require("express");
const { User } = require("../db");
const {Account} = require("../db");
const { authMiddleware } = require("../middleware");

const router = express.Router();

// an endpoint for user to get their balance
router.get("/balance",authMiddleware, async (req,res) => {
    const account = await Account.findOne({
        userId: req.userId
    });

    res.json({
        balance: account.balance
    })
})

router.post("/transfer",authMiddleware, async(req,res) => {
    // check : if sender has enough balance in their account
    // then verify if the recieving user already exists in the db
    // if it does exist, then 1st deduct the amount from sender's account
    // then credit the amount to reciever's amount

    // using transactions

    const session = await mongoose.startSession();

    session.startTransaction();
    const {amount, to} = req.body;

    //fetch accounts within transaction

    const account = await Account.findOne({
        userId: req.userId
    }).session(session);

    if(!account || account.balance < amount){
        await session.abortSession();
        return res.status(400).json({
            message: "Insufficient Balance"
        });
    }

    const toAccount = await Account.findOne({userId: to}).session(session);

    if(!toAccount){
        await session.abortSession();
        return res.status(400).json({
            message: "Invalid reciever's account"
        })
    }

    // after successful validation checks for account and balance, perform the transfer

    await Account.updateOne({ userId: req.userId}, {
        $inc: { balance: -amount}
    }).session(session);

    await Account.updateOne({ userId: to}, {
        $inc: { balance: amount}
    }).session(session);

    //Commit the transaction

    await session.commitTransaction();
    res.json({
        message: "Transfer Successful"
    })

})

// an endpoint for user to transfer money to another account

// 

module.exports = router;