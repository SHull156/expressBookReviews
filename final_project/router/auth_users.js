const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const doesExist = (username)=> {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    return userswithsamename.length > 0
}

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

regd_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    //check if both username and password are provided
    if (username && password){
        //check if the user does not already exist
        if (!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message:"User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;