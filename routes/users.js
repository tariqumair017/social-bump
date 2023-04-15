const express  = require("express");
const router   = express.Router();
const users    = require("../controllers/users");
const passport = require("passport");
const asyncHandler = require("express-async-handler");  
const User     = require("../models/user");

//Root Route
router.get("/", (req, res) => {
    res.render("landing");
});

//======================
// AUTHENTICATION ROUTES
//======================

//Show Sign Up form
router.get("/register", users.register);

//Handel Sign Up Logic
router.post("/register", asyncHandler(users.registerHandle));

//Show Login form
router.get("/login", users.login);

//Handel Login Logic ("/login", middleware, callback)
router.post("/login", passport.authenticate("local", {
    failureFlash: true, 
    failureRedirect: "/login"
}), users.loginHandle);

//Logout Route
router.get("/logout", users.logout);



module.exports = router;