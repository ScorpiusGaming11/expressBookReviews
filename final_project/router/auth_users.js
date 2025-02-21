const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if the user exists
const isValid = (username)=>{ //returns boolean
  let validUsers = users.filter((user) => {
    return user.username = username;
  });

  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
}

// Authenticate the user
const authenticatedUser = (username,password)=>{ //returns boolean
  if (isValid(username)) {
    let authenticatedUsers = users.filter((user) => {
      return (user.username === username && user.password === password);
    })

    if (authenticatedUsers.length > 0) {
      return true;
    } else {
      return false;
    }
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({
        data: password
      }, "access", { expiresIn: "1d" });

      req.session.authorization = {
        accessToken, username
      }

      return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
  } else {
    return res.status(404).json({ message: "Error logging in" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const ISBN = req.params.isbn;
  let book = books[ISBN];
  let reviewAddedOrModified = false;

  if (book) {
    let username = req.user.username;
    let review = req.body.review;

    Object.keys(book['reviews']).forEach((key, index) => {
      if (book['reviews'][key].username === username) {
        book['reviews'][key].review = review;
        reviewAddedOrModified = true;
        return;
      }
    });

    if (!reviewAddedOrModified) {
      book['reviews'][Object.keys(book['reviews']).length + 1] = { username: username, review: review };
    }

    res.send(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const ISBN = req.params.isbn;
  let book = books[ISBN];

  if (book) {
    let username = req.user.username;
    for (const review in book['reviews']) {
      if (book['reviews'][review].username === username) {
        delete book['reviews'][review];
        break;
      }
    }
    res.send(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
