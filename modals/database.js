const mongoose = require('mongoose');

const uri ="mongodb+srv://devanshu:devanshu09@cluster0.21ojnza.mongodb.net/users?retryWrites=true&w=majority"
async function connect() {
    try{
        await mongoose.connect(uri)
        console.log("connected to Database")
    }catch(err){
        console.log("Error connecting to Database")
        console.log(err)
    }
}


module.exports = connect;