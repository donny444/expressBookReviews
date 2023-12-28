const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  const sameName = users.filter((user) => {
    return user.username === username;
  })
  if (sameName.length > 0) {
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username,password)=>{
  for (let user of users) {
    if (user.username == username && user.password == password) {
      return true;
    }
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;
  const user = { username: username, password: password}

  if (username && password) {
    if (authenticatedUser(username, password)) {
      return res.status(200).json({message: "User logged in!"});
    } else {
      return res.status(404).json({message: "Username and/or password incorrected"});
    }
  }
  return res.status(404).json({message: "Unable to login."});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  let booksIsbn = Object.keys(books);
  let filteredBook = booksIsbn.filter((book) => book == isbn);
  let allReviews = books[filteredBook].reviews;

  if (filteredBook) {
    for (let eachReview in allReviews) {
      if (Object.keys(eachReview) == user.username) {
        Object.values(eachReview) = review;
        return res.status(200).json({message: "Review updated!"});
      } else {
        reviews.push({username: review});
        return res.status(200).json({message: "Review added!"});
      }
    }
  } else {
    return res.status(404).json({message: "ISBN invalid."});
  }
  return res.status(404).json({message: "Unable to review."});
});

regd_users.delete("/auth/review/:isbn", (req, res) =>{

});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
