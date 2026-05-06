const express = require('express');
const userRouter = require("./user");

const router = express.Router(); // all requests starts from /api/v1

router.use("/user", userRouter);
module.exports = router;