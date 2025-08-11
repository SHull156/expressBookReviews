const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

// Session middleware must come BEFORE routes that use session
app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// Auth middleware for protected routes under /customer/auth/*
app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session.authorization) {
      let token = req.session.authorization.accessToken;
  
      jwt.verify(token, "access", (err, user) => {
        if (!err) {
          req.user = user.data;
          next();
        } else {
          return res.status(403).json({ message: "User not authenticated" });
        }
      });
    } else {
      return res.status(403).json({ message: "User not logged in" });
    }
  });

// Customer routes (register, login, etc)
app.use("/customer", customer_routes);

// General routes
app.use("/", genl_routes);

const PORT = 5000;
app.listen(PORT, () => console.log("Server is running"));
