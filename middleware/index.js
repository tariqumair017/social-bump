const Wallet      = require("../models/wallet");
const Comment     = require("../models/comment");
const { walletSchema, commentSchema }    = require("../schemas.js");

//All middleware are here
let middlewareObj = {};

middlewareObj.checkWalletOwnership = async function(req, res, next)
{
    //is user Logged in?
    if(req.isAuthenticated())
        {
            const foundWallet = await Wallet.findById(req.params.id);
            //does user create the Wallet?
            if(!foundWallet.author.id.equals(req.user._id))
            {
                req.flash("error", "You Don't have Permission to do that!");
                return res.redirect(`/wallets/${req.params.id}`);
            }
            next();
        }
        else
        {
            req.session.returnTo = req.originalUrl;
            req.flash("error", "Please Login First!");
            return res.redirect("/login");
        }
}

middlewareObj.checkCommentOwnership = async function(req, res, next)
{
    //is user Logged in?
    if(req.isAuthenticated())
        {
            const foundComment = await Comment.findById(req.params.comment_id);
            //does user create the Comment?
            if(!foundComment.author.id.equals(req.user._id))
            {
                req.flash("error", "You Don't have Permission to do that!");
                return res.redirect(`/wallets/${req.params.id}`);
            }
            next();    
        }
        else
        { 
            req.flash("error", "Please Login First!");
            return res.redirect("/login");
        }
}

middlewareObj.isLoggedin = function(req, res, next)
{
    if(!req.isAuthenticated())
    {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "Please Login First!");
        return res.redirect("/login");
    }
    return next();
}


//Joi Validation Middleware
middlewareObj.validateWallet = (req, res, next) => { 
    const { error } = walletSchema.validate(req.body);
    if(error)
    {
        const msg = error.details.map(el => el.message).join(",");
        console.log(msg);
        req.flash("error", msg);
        return res.redirect("/wallets/new");
    }
    else
    {
        next();
    }
}


middlewareObj.validateComment = (req, res, next) => { 
    const { error } = commentSchema.validate(req.body);
    if(error)
    {
        const msg = error.details.map(el => el.message).join(",");
        console.log(msg);
        req.flash("error", msg);
        return res.redirect(`/wallets/${req.params.id}`);
    }
    else
    {
        next();
    }
}


module.exports = middlewareObj;