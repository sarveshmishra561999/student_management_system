const mongoose = require('mongoose');
require('dotenv/config');
const connectDb=async()=>{
    try {
        await mongoose.connect(process.env.CONNECTION_STRING) 
        console.log("connection successfull to db")
    } catch (error) {
        console.error("DB connection faild")
        process.exit(0)
    }
}
module.exports=connectDb;
