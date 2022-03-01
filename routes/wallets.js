const { Console } = require("console");
const express = require("express");
const router = express.Router();
const Wallet    = require("../models/wallet");
const middleware = require("../middleware/index");


//Index - Show all Wallets from DB
router.get("/wallets", (req, res) => {
    Wallet.find({}, (err, allWallets) => {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("wallets/index", {data: allWallets});
        }
    });
});

//Create - Add new Wallet to DB
router.post("/wallets", middleware.isLoggedin, (req, res) => {
    let naam = req.body.name;
    let price = req.body.price;
    let image = req.body.image;
    let desc = req.body.description;
    let currentAuthor = {
        id: req.user._id,
        username: req.user.username
    }
    let newWallet = {name: naam, img: image, price: price, description: desc, author: currentAuthor};
    //Create a new wallet and save to DB
    Wallet.create(newWallet, (err, new_wallet) => {
        if(err)
        {
            console.log(err);
        }
        else
        {
            req.flash("success", "New Wallet is Created Successfully!");
            res.redirect("/wallets");
        }
    });
});

//New - Show form to create new wallet 
router.get("/wallets/new", middleware.isLoggedin, (req, res) => {
    res.render("wallets/new");
});

//Show - Show more info about one wallet
router.get("/wallets/:id", (req, res) => {
    //find the wallet with provided ID
    Wallet.findById(req.params.id).populate("comments").exec((err, foundwallet) => {
        if(err)
        {
            console.log(err);
        }
        else
        { 
            res.render("wallets/show", {found: foundwallet});
        }
    });
});

//Edit - Edit Wallet Route
router.get("/wallets/:id/edit", middleware.checkWalletOwnership, (req, res) => {  
    Wallet.findById(req.params.id, (err, foundWallet) => {
            res.render("wallets/edit", {fwallet: foundWallet});     
        });
});

//Update - Update Wallet Route
router.put("/wallets/:id", middleware.checkWalletOwnership, (req, res) => {
    //find and update the correct wallet
    Wallet.findByIdAndUpdate(req.params.id, req.body.data, (err, updatedWallet) => {
        if(err)
        {
            res.redirect("/wallets");
        }
        else
        {
            req.flash("success", "Wallet Updated!");
            res.redirect("/wallets/" + req.params.id);
        }
    });
});

//Destroy - Destroy Wallet Route
router.delete("/wallets/:id", middleware.checkWalletOwnership, (req, res) => {
    Wallet.findByIdAndRemove(req.params.id, (err) => {
        if(err)
        {
            res.redirect("/wallets");
        }
        else
        {
            req.flash("success", "Wallet Deleted Successfully!");
            res.redirect("/wallets");
        }
    });
});



module.exports = router;