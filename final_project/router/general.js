const express = require('express');
let books = require("./booksdb.js");
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  // Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
      const data = await new Promise((resolve) => {
        setTimeout(() => resolve({ books: books }), 3000);
      });
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  });

// Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const get_books_isbn = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        // Check if the ISBN exists in the books object
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject('ISBN not found');
        }
    });

    get_books_isbn
        .then((book) => {
            res.send(book);
            console.log("Promise for Task 11 is resolved");
        })
        .catch((error) => {
            res.status(404).send(error);
            console.log('ISBN not found');
        });
});

// Get book details by author
public_users.get('/author/:author', function (req, res) {
    const get_books_author = new Promise((resolve, reject) => {
      
      let booksbyauthor = [];
      let isbns = Object.keys(books);
      isbns.forEach((isbn) => {
        if (books[isbn]["author"].toLowerCase() === req.params.author.toLowerCase()) {
          booksbyauthor.push({
            "isbn": isbn,
            "title": books[isbn]["title"],
            "reviews": books[isbn]["reviews"]
          });
        }
      });
  
      if (booksbyauthor.length > 0) {
        resolve(booksbyauthor);
      } else {
        reject("The mentioned author does not exist");
      }
    });
  
    get_books_author
      .then((books) => {
        res.send(JSON.stringify({ booksbyauthor: books }, null, 4));
        console.log("Promise is resolved");
      })
      .catch((err) => {
        res.status(404).send(err);
        console.log("The mentioned author does not exist");
      });
  });

  // Get all books based on title
  public_users.get('/title/:title', function (req, res) {
    const get_books_title = new Promise((resolve, reject) => {
      
      let booksbytitle = [];
      let isbns = Object.keys(books);
      isbns.forEach((isbn) => {
        if (books[isbn]["title"].toLowerCase() === req.params.title.toLowerCase()) {
          booksbytitle.push({
            "isbn": isbn,
            "author": books[isbn]["author"],
            "reviews": books[isbn]["reviews"]
          });
        }
      });
  
      if (booksbytitle.length > 0) {
        resolve(booksbytitle);
      } else {
        reject("The mentioned title does not exist");
      }
    });
  
    get_books_title
      .then((books) => {
        res.send(JSON.stringify({ booksbytitle: books }, null, 4));
        console.log("Promise is resolved");
      })
      .catch((err) => {
        res.status(404).send(err);
        console.log("The mentioned title does not exist");
      });
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
