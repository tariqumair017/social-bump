const express              = require("express");
const app                  = express();
const flash                = require("connect-flash");
const bodyParser           = require("body-parser");
const mongoose             = require("mongoose");
const passport             = require("passport");
const localStrategy        = require("passport-local");  
const methodOverride       = require("method-override");
const Wallet               = require("./models/wallet");
const Comment              = require("./models/comment");
const User                 = require("./models/user");
const seedingDB            = require("./seeds");
const port     = process.env.PORT || 8000;


//Requring Routes
const walletRoutes  = require("./routes/wallets");
const commentRoutes = require("./routes/comments");
const indexRoutes   = require("./routes/index");

// mongoose.connect("mongodb://localhost:27017/h_wallet");
mongoose.connect("mongodb+srv://umair:ZtTyXSpZRWs0BwxU@cluster0.bxdwo.mongodb.net/hellowallet?retryWrites=true&w=majority");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedingDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Amad is my cutest brother!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(walletRoutes);
app.use(commentRoutes);
app.use(indexRoutes);





// Tell Express to Listen request
app.listen(port, () => {
    console.log(`Server has started at http://localhost:${port}`);
  });
