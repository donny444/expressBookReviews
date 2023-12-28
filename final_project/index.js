const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const axios = require('axios')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

const payload = {};
const secretKey = "access";

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", function auth(req, res, next) {

    let accessToken = jwt.sign(payload, secretKey, { expiresIn: 60 * 60});
      req.session.authorization = { accessToken };
       
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken']; // Access Token

        jwt.verify(token, secretKey, (err, user) => {
            if (!err) {
                req.user = user;
                next();
            }
            else {
                return res.status(403).json({ message: "User not authenticated" })
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" })
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running on port " + PORT));
