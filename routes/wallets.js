const express = require("express");
const router = express.Router();
const wallets = require("../controllers/wallets");
const asyncHandler = require("express-async-handler");   
const middleware = require("../middleware/index"); 

const { storage } = require("../cloudinary-config");
const multer  = require('multer')
const upload = multer({ storage })

//Index - Show all Wallets from DB
router.get("/", asyncHandler(wallets.index));

//New - Show form to create new wallet 
router.get("/new", middleware.isLoggedin, wallets.newWallet);

//Create - Add new Wallet to DB
router.post("/", middleware.isLoggedin, upload.array('img'), middleware.validateWallet, asyncHandler(wallets.newWalletHandle));

//Show - Show more info about one wallet
router.get("/:id", asyncHandler (wallets.showSingleWallet));

//Edit - Edit Wallet Route
router.get("/:id/edit", middleware.checkWalletOwnership, asyncHandler (wallets.editWallet));

//Update - Update Wallet Route
router.put("/:id", middleware.checkWalletOwnership, upload.array('img'), middleware.validateWallet, asyncHandler (wallets.updateWallet));

//Destroy - Destroy Wallet Route
router.delete("/:id", middleware.checkWalletOwnership, asyncHandler (wallets.destroyWallet));



module.exports = router;