if(process.env.NODE_ENV !== "production")
{
    require("dotenv").config();
} 

const express              = require("express");
const app                  = express();
const path                 = require("path");
const flash                = require("connect-flash"); 
const bodyParser           = require("body-parser");
const mongoose             = require("mongoose");
const ejsMate              = require("ejs-mate");
const passport             = require("passport");
const LocalStrategy        = require("passport-local");  
const methodOverride       = require("method-override");
const session              = require("express-session");
const Wallet               = require("./models/wallet");
const Comment              = require("./models/comment");
const User                 = require("./models/user");
const seedingDB            = require("./seeds");
const port     = process.env.PORT || 8000;


//Requring Routes
const userRoutes    = require("./routes/users");
const walletRoutes  = require("./routes/wallets");
const commentRoutes = require("./routes/comments");
// const indexRoutes   = require("./routes/index");

mongoose.connect("mongodb://127.0.0.1:27017/h_wallet", {useNewUrlParser: true , useUnifiedTopology: true});
// mongoose.connect("mongodb+srv://umair:ZtTyXSpZRWs0BwxU@cluster0.bxdwo.mongodb.net/hellowallet?retryWrites=true&w=majority");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {console.log("Database Connected");});

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(flash());
//seedingDB();

// PASSPORT CONFIGURATION
app.use(session({
    secret: "Amad is my cutest brother!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){ 
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(userRoutes);
app.use('/wallets', walletRoutes);
app.use('/wallets/:id/comments', commentRoutes);
// app.use(indexRoutes);


app.all('*', (req, res, next) => {
    res.status(404).send("Page Not Found");
}); 

app.use((err, req, res, next) => {
    res.send(`oh boy, Somethis went wrong`);
    // res.send(next);
});


// Tell Express to Listen request
app.listen(port, () => {
    console.log(`Server has started at http://localhost:${port}`);
  });
