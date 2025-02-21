const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// check if user already exists
const doesExist = (username) => {
  let usersMatched = users.filter((user) => {
    user.username = username;
  });

  if (usersMatched.length > 0) {
    return true;
  } else {
    return false;
  }
}

// Register new users
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if(!doesExist(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  res.send(books[ISBN]);
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksByAuthor = [];

  Object.keys(books).forEach(function (key, index) {
    if (books[key].author === author) {
      booksByAuthor.push(books[key]);
    }
  });

  if (booksByAuthor.length > 0) {
    res.send(booksByAuthor);
  } else {
    res.status(404).send({ error: 'Author not found' });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const matchedBooks = [];

  Object.keys(books).forEach(function (key, index) {
    if (books[key].title === title) {
      matchedBooks.push(books[key]);
    }
  });

  if (matchedBooks.length > 0) {
    res.send(matchedBooks);
  } else {
    res.status(404).send({ error: 'Title not found' });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  res.send(books[ISBN].reviews);
});

module.exports.general = public_users;
