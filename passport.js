const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github").Strategy;
passport.serializeUser(function (user, done) {
  /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
  done(null, user);
});
//google stratergy
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "1065999842186-sfp678fm008f6hfdnqgis3p8qpjs63be.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      /*
     use the profile info (mainly profile id) to check if the user is registerd in ur db
     If yes select the user and pass him to the done callback
     If not create the user and then select him and pass to callback
    */
      console.log(profile);
      return done(null, profile);
    }
  )
);
//github stratergy

passport.use(
  new GitHubStrategy(
    {
      clientID: "fa9f14a3bea1efc2075b",
      clientSecret: "06c92df39f0c1aca36738be231a1661d8d24a5a7",
      callbackURL: "http://localhost:3000/github/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      cb(null, profile);
    }
  )
);
