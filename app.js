const express = require("express");
const app = express();
const path = require("path");  
const port = process.env.PORT || 5000;


//Requring Routes  
const indexRoutes   = require("./routes/index");

// mongoose.connect("mongodb://127.0.0.1:27017/h_wallet", {useNewUrlParser: true , useUnifiedTopology: true}); 
// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {console.log("Database Connected");});
 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true})); 
app.use(express.static(path.join(__dirname, "public")));   

 
// Using Routes
app.use(indexRoutes); 

app.all('*', (req, res, next) => {
    res.status(404).send("Page Not Found");
}); 
 

// Tell Express to Listen request
app.listen(port, () => {
    console.log(`Server has started at http://localhost:${port}`);
});
