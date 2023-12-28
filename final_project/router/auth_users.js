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

  if (username && password) {
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({
        data: user
      }, "access", { expiresIn: 60 * 60});
      req.session.authorization = { accessToken };
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
  const username = req.query.username;
  const review = req.query.review;
  let booksIsbn = Object.keys(books);
  let filteredBook = booksIsbn.filter((book) => book == isbn);
  let reviews = books[filteredBook].reviews;

  if (filteredBook != []) {
    for (let eachReview in reviews) {
      if (eachReview.username == username) {
        eachReview.review = review;
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

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
