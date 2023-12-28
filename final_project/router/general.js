const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User " + username + " registered."});
    } else {
      return res.status(404).json({message: "Username already exists,"});
    }
  }
  return res.status(404).json({ message: "Unable to register." });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const response = await fetch({message: books});
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return res.status(200).data;
  } catch(error) {
    console.error(`Could not get books: ${error}`);
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  let booksIsbn = Object.keys(books);
  let filteredBook = booksIsbn.filter((book) => book == isbn);
  return res.status(200).json({ message: books[filteredBook] });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let booksArray = Object.values(books);
  let filteredBooks = [];

  for(let book of booksArray) {
    if (book.author === author) {
      filteredBooks.push(book);
    }
  }
  return res.status(200).json({ message: filteredBooks});
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let booksArray = Object.values(books);
  let filteredBooks = [];

  for(let book of booksArray) {
    if (book.title === title) {
      filteredBooks.push(book);
    }
  }
  return res.status(200).json({message: filteredBooks});
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  let booksIsbn = Object.keys(books);
  let filteredBook = booksIsbn.filter((book) => book == isbn);
  return res.status(300).json({ message: books[filteredBook].reviews });
});

module.exports.general = public_users;
