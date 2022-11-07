
const mongoose = require("mongoose")
const dev = require(".")
const connectDB = async()=>{
    try{
    //connecting mongoose with url we created on config ->index.js
        await mongoose.connect(dev.db.url)
        console.log("db is connected")

    }
    catch(error){ 
        console.log("db is  notconnected")
        console.log(error.message)
        process.exit(1);


    }

}
module.exports = connectDB;