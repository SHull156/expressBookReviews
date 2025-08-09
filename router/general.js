const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  //check if book exists
  if (book){
  //send formatted JSON
    res.send(JSON.stringify(book, null, 4));
  } else{
    res.status(404).json({message: "Book not found"});
  } 
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const matchingBooks = [];

  //loop through all books to find matches
  for (let key in books){
    if(books[key].author.toLowerCase()=== author.toLowerCase()){
        matchingBooks.push(books[key]);
    }
  }

  if (matchingBooks.length > 0){
    res.send(JSON.stringify(matchingBooks, null, 4));
  } else{
    res.status(404).json({message:"No books found for this author"});
   }
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const matchingBooks = [];

  for (let key in books){
    if(books[key].title.toLowerCase()=== title.toLowerCase()){
        matchingBooks.push(books[key]);
    }
  }

  if (matchingBooks.length > 0){
    res.send(JSON.stringify(matchingBooks, null, 4));
  } else{
    res.status(404).json({message: "No books found for this title"});
  }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.send(JSON.stringify(book.reviews,null, 4));
  }else {
    res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
