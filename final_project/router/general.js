const express = require('express');
let books = require("./booksdb.js");
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  // Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/books', (req, res) => {
    Promise.resolve(books)
      .then(data => res.json(data))
      .catch(err => res.status(500).json({ message: 'Failed to fetch books' }));
  });
  
// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    Promise.resolve(books[isbn])
        .then(data => {
            if (data) {
                res.json(data);
            } else {
                res.status(404).json({message:'Book not found'});
            }
        })
        .catch(err => res.status(500).json({ message: 'Failed to fetch book' }));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
    
    new Promise((resolve, reject) => {
      const matchingBooks = [];
  
      for (let key in books){
          if (books[key].author.toLowerCase() === author) {
              matchingBooks.push(books[key]);
          }
      }
  
      if (matchingBooks.length > 0){
          resolve(matchingBooks);
      } else {
          reject("No books found for this author");
      }
    })
    .then(data => res.json(data))
    .catch(err => res.status(404).json({message: err}));
  });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    
    new Promise((resolve, reject) => {
      const matchingBooks = [];
  
      for (let key in books){
        if (books[key].title.toLowerCase() === title){
          matchingBooks.push(books[key]);
        }
      }
  
      if (matchingBooks.length > 0){
        resolve(matchingBooks);
      } else {
        reject("No books found for this title");
      }
    }) // <-- this closing parenthesis was missing
    .then(data => res.json(data))
    .catch(err => res.status(404).json({message: err}));
  });
 

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.send(JSON.stringify(book.reviews, null, 4));
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

module.exports.public_users = public_users;
