const express = require('express');
const rootRouter = require("./routes/index");
const accountRouter = require("./routes/account");
const cors = require('cors')

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1",rootRouter);
app.use("/api/v1/account",accountRouter);




app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
