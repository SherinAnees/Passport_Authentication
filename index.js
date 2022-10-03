const express = require("express");
const passport = require("passport");
const PORT = 3000;
const app = express();
const session = require("express-session");
const cors = require("cors");
require("./passport");
app.use(cors());

// parse application/x-www-form-urlencoded
// parse application/json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// For an actual app you should configure this with an experation time, better keys, proxy and secure
app.use(
  session({
    secret: "top secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Auth middleware that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

//Initialize passport and passport session
app.use(passport.initialize());
app.use(passport.session());

// Example protected and unprotected routes
app.get("/", (req, res) => res.send("Example Home page!"));
app.get("/failed", (req, res) => res.send("You Failed to log in!"));

// In this route you can see that if the user is logged in u can acess his info in: req.user
app.get("/login", isLoggedIn, (req, res) =>
  res.send(`Welcome mr ${req.user.displayName}!`)
);

// Auth Routes for google
app.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/login");
  }
);
//auth for github
app.get("/github", passport.authenticate("github"));

app.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/failed" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/login");
  }
);
//logout
app.get("/logout", (req, res) => {
  req.logout(req.user, (err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

app.listen(3000, () => console.log(`Example app listening on port ${3000}!`));
