const express  = require("express");
const router   = express.Router();
const passport = require("passport");
const User     = require("../models/user");

//Root Route
router.get("/", (req, res) => {
    res.render("landing");
});

//======================
// AUTHENTICATION ROUTES
//======================

//Show Sign Up form
router.get("/register", (req, res)=> {
    res.render("register");
});
//Handel Sign Up Logic
router.post("/register", (req, res)=> {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err)
        {
            req.flash("error", err.message);
            return res.render("register");
        }
       passport.authenticate("local")(req, res, ()=> {
           req.flash("success", "Welcome to Hello_Wallet => " + user.username);
           res.redirect("/wallets");
       });
    });
});

//Show Login form
router.get("/login", (req, res)=> {
    res.render("login");
});
//Handel Login Logic ("/login", middleware, callback)
router.post("/login", passport.authenticate("local", {
    successRedirect: "/wallets",
    failureRedirect: "/login"
}), (req, res)=> {
});

//Logout Route
router.get("/logout", (req, res)=> {
    req.logout();
    req.flash("success", "Logged you Out!");
    res.redirect("/wallets");
});



module.exports = router;