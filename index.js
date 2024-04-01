const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv =require("dotenv");

const app = express ();
dotenv.config();

const port = process.env.PORT || 5000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.h7yomau.mongodb.net/registrationFormDB`);

//registration schema
const registrationSchema = new mongoose.Schema({
    firstN: String,
    lastN: String,
    email: String,
    password: String
});

//model of registration schema
const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded ({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/Pages/index.html");
})

app.post("/register", async (req, res) => {
    try{
        const{firstN, lastN, email, password} = req.body;

        const existingUser = await Registration.findOne({email : email});
        //check for existing user
        if(!existingUser){
            const registrationData = new Registration({
                firstN,
                lastN,
                email,
                password
            });
            await registrationData.save();
            res.redirect("/registration-successful");
        }
        else{
            console.log("User already exists");
            res.redirect("/registration-error");
        }
    }
    catch(error){
        console.log(error);
        res.redirect("/registration-error");
    }
})

app.get("/registration-successful", (req, res)=>{
    res.sendFile (__dirname+"/Pages/registration-successful.html") ;
})

app.get("/registration-error", (req, res)=>{
    res.sendFile (__dirname+"/Pages/registration-error.html") ;
})

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
})