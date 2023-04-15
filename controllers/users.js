const User = require("../models/user");

module.exports.register = (req, res)=> {
    res.render("users/register");
}

module.exports.registerHandle = async (req, res, next)=> {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);  
    req.login(registeredUser, err => {
        if(err) return next(err);
        req.flash("success", "Welcome to Hello Wallet");
        res.redirect("/wallets");
    }) 
}

module.exports.login = (req, res)=> {
    res.render("users/login");
} 

module.exports.loginHandle = (req, res)=> {      
    const redirectUrl = req.session.returnTo || "/wallets";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res)=> {
    req.logout();
    req.flash("success", "Logged you Out!");
    res.redirect("/wallets");
}