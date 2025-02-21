const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Register new users
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if(!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop --> WITHOUT PROMISE
// public_users.get('/',function (req, res) {
//   res.send(JSON.stringify(books, null, 4));
// });

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    try {
      resolve(books);
    } catch (err) {
      reject(err);
    }
  })
  .then((booksData) => {
    res.json(booksData);
  })
  .catch((error) => {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Internal server error" });
  });
});

// Get book details based on ISBN --> WITHOUT PROMISE
// public_users.get('/isbn/:isbn',function (req, res) {
//   const ISBN = req.params.isbn;
//   res.send(books[ISBN]);
// });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  new Promise((resolve, reject) => {
    try {
      const book = books[ISBN];
      if (book) {
        resolve(book);
      } else {
        reject(new Error("Book not found"));
      }
    } catch (err) {
      reject(err);
    }
  })
  .then((book) => {
    res.json(book);
  })
  .catch((error) => {
    console.error("Error fetching book:", error);
    res.status(404).json({ message: "Book not found" });
  })
});

// Get book details based on author --> WITHOUT PROMISE
// public_users.get('/author/:author',function (req, res) {
//   const author = req.params.author;
//   const booksByAuthor = [];

//   Object.keys(books).forEach(function (key, index) {
//     if (books[key].author === author) {
//       booksByAuthor.push(books[key]);
//     }
//   });

//   if (booksByAuthor.length > 0) {
//     res.send(booksByAuthor);
//   } else {
//     res.status(404).send({ error: 'Author not found' });
//   }
// });

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    try {
      const booksByAuthor = [];
      Object.keys(books).forEach(function (key, index) {
        if (books[key].author === author) {
          booksByAuthor.push(books[key]);
        }
      });

      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject(new Error("Author not found"));
      }
    } catch (err) {
      reject(err);
    }
  })
  .then((booksByAuthor) => {
    res.json(booksByAuthor);
  })
  .catch((error) => {
    console.error("Error fetching books:", error);
    res.status(404).json({ error: 'Author not found' });
  });
});

// // Get all books based on title --> WITHOUT PROMISE
// public_users.get('/title/:title',function (req, res) {
//   const title = req.params.title;
//   const matchedBooks = [];

//   Object.keys(books).forEach(function (key, index) {
//     if (books[key].title === title) {
//       matchedBooks.push(books[key]);
//     }
//   });

//   if (matchedBooks.length > 0) {
//     res.send(matchedBooks);
//   } else {
//     res.status(404).send({ error: 'Title not found' });
//   }
// });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title
  new Promise((resolve, reject) => {
    try {
      const matchedBooks = [];
      Object.keys(books).forEach(function (key, index) {
        if (books[key].title === title) {
          matchedBooks.push(books[key]);
        }
      });

      if (matchedBooks.length > 0) {
        resolve(matchedBooks);
      } else {
        reject(new Error("Title not found"));
      }
    } catch (err) {
      reject(err);
    }
  })
  .then((matchedBooks) => {
    res.json(matchedBooks);
  })
  .catch((error) => {
    console.error("Error fetching books:", error);
    res.status(404).json({ error: 'Title not found' });
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  res.send(books[ISBN].reviews);
});

module.exports.general = public_users;
