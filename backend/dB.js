
const mongoose= require("mongoose")
const { number } = require("zod")
require('dotenv').config();

mongoose.connect(process.env.URL).then(()=>{
    console.log("connected")
}).catch(err=>{
    console.error("error connection ", err);
});
const UserSchema= new mongoose.Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
})

const AccountSchema= new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }, 
    balance: {
        type: Number,
        required: true
    }
})

const Account= mongoose.model("Account" , AccountSchema)
const User= mongoose.model("User", UserSchema)


module.exports= {
    User,
    Account
}