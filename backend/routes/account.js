const express = require("express");
const mongoose = require("mongoose");
const { z } = require("zod");
const { Account } = require("../db");
const { authMiddleware } = require("../middleware");

const router = express.Router();

const transferSchema = z.object({
    to: z.string().refine(
        value => mongoose.isValidObjectId(value),
        "Invalid recipient"
    ),
    amount: z.number()
        .finite()
        .positive()
        .max(1000000)
        .refine(
            value => Number.isInteger(value),
            "Amount must be an integer"
        )
});

router.post("/transfer", authMiddleware, async (req, res) => {
    const validation = transferSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            message: "Invalid transfer details",
            errors: validation.error.issues
        });
    }

    const { amount, to } = validation.data;
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const account = await Account.findOne({
            userId: req.userId
        }).session(session);

        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }

        if (String(req.userId) === String(to)) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "You cannot transfer money to yourself"
            });
        }

        const toAccount = await Account.findOne({
            userId: to
        }).session(session);

        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                message: "Invalid recipient account"
            });
        }

        await Account.updateOne(
            { userId: req.userId },
            { $inc: { balance: -amount } }
        ).session(session);

        await Account.updateOne(
            { userId: to },
            { $inc: { balance: amount } }
        ).session(session);

        await session.commitTransaction();

        return res.json({
            message: "Transfer successful"
        });
    } catch (error) {
        await session.abortTransaction();

        return res.status(500).json({
            message: "Transaction failed"
        });
    } finally {
        await session.endSession();
    }
});
