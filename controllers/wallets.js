const Wallet = require("../models/wallet");
const { cloudinary } = require("../cloudinary-config");


module.exports.index = async (req, res, next) => {
    const data = await Wallet.find({});  
    res.render("wallets/index", { data }); 
}

module.exports.newWallet = (req, res, next) => {
    res.render("wallets/new");
}

module.exports.newWalletHandle = async(req, res, next) => {  
    
    const walletFound = await Wallet.findOne({name: req.body.data.name});
    
    if(walletFound)
    {
        console.log("Wallet with Same Name is Already Exist!");
        req.flash("error", `Name "${walletFound.name}" is Already Exist!`);
        return res.redirect("wallets/new");
    }
    else
    {  
        req.body.data.author = {
            id: req.user._id,
            username: req.user.username
        } 
    
        var newWallet = new Wallet(req.body.data);
        newWallet.images = req.files.map(f => ({url: f.path, filename: f.filename}));
        await newWallet.save();
        req.flash("success", "New Wallet is Created Successfully!");
        res.redirect(`/wallets/${newWallet._id}`);
    }   
}

module.exports.showSingleWallet = async (req, res, next) => {
    //find the wallet with provided ID
    const foundwallet = await Wallet.findById(req.params.id).populate({path: "comments", options: {sort: {$natural:-1}}});
    if(!foundwallet)
    {
        req.flash("error", "Cannot find that Wallet!");
        return res.redirect("/wallets");
    } 
    
    res.render("wallets/show", {found: foundwallet}); 
}

module.exports.editWallet = async (req, res, next) => { 
    const { id } = req.params;
    const foundWallet = await Wallet.findById(id); 
    if(!foundWallet)
    {
        req.flash("error", "Cannot find that Wallet!");
        return res.redirect("/wallets");
    }  
    res.render("wallets/edit", {fwallet: foundWallet});  
}

module.exports.updateWallet = async (req, res, next) => {
    //find and update the correct wallet
    const { id } = req.params; 
    const updatedWallet = await Wallet.findByIdAndUpdate(id, { ...req.body.data });
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    updatedWallet.images.push(...imgs);
    if(req.body.deleteImages)
    {
        for (const iterator of req.body.deleteImages) {
            await cloudinary.uploader.destroy(iterator);
        }
        await updatedWallet.updateOne({ $pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    await updatedWallet.save();
    req.flash("success", "Wallet Updated!");
    res.redirect(`/wallets/${updatedWallet._id}`);  
}

module.exports.destroyWallet = async (req, res, next) => { 
    const { id } = req.params; 
    await Wallet.findByIdAndDelete(id);
    req.flash("success", "Wallet Deleted Successfully!");
    res.redirect("/wallets"); 
}