require("dotenv").config();

const express = require("express");
const cors = require("cors");
const schedulerRouter = require("./routes/schedulerRouter");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/scheduler", schedulerRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
