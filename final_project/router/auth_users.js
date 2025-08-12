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

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

regd_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    //check if both username and password are provided
    if (username && password){
        //check if the user does not already exist
        if (!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message:"Customer successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user;

  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review by user not found" });
  }

  // Delete the review for the logged in user
  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: `Review for the ISBN ${isbn} posted by ${username} has been deleted.`,
    reviews: books[isbn].reviews
  });
});


//only registered users can login
regd_users.post("/login", (req, res) => {
    console.log("Login endpoint hit with: ", req.body);
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  console.log("Current users:", users);

  if (authenticatedUser(username, password)) {
    // Generate JWT token with username as payload
    let accessToken = jwt.sign({ data: username }, 'access', { expiresIn: 60 * 60 });

    // Store token and username in session
    req.session.authorization = { accessToken, username };

    return res.status(200).json({ message: "Customer successfully logged in" });
  } else {
    return res.status(401).json({ message: "Invalid login. Check username and password" });
  }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user;

  if (!username){
    return res.status(403).json({message: "User not logged in"});
  }
     
  if (!review){
    return res.status(400).json({message: "Review query parameter missing"})
  }

  if (!books[isbn]){
    return res.status(404).json({message: "Book not found"});
  }

  if (!books[isbn].reviews){
    books[isbn].reviews = {};
  }

  //add or update the review for this username
  books[isbn].reviews[username] = review;
  
    return res.status(200).json({
    message: `The review for book ${isbn} has been added/updated by ${username}: "${review}"`,
    reviews: books[isbn].reviews
});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;