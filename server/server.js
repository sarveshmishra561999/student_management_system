
require('dotenv/config');
const express = require("express")
const app = express();
const router = require("./router/student-router")
const connectDb = require("./utils/db")
const errorMiddleware=require("./middlewares/error-middleware")
const cors=require("cors")
const corsOption={
    origin:[process.env.CLIENT_URL],
    methods:"GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials:true,
}
app.use(cors(corsOption))
app.use(express.json())
app.use("/api/auth", router);
app.use(errorMiddleware)
const PORT = 5000;
connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`server is running at port:${PORT}`)
    })
})

