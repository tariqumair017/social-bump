const Wallet      = require("../models/wallet");
const Comment     = require("../models/comment");

//All middleware are here
let middlewareObj = {};

middlewareObj.checkWalletOwnership = function(req, res, next)
{
    //is user Logged in?
    if(req.isAuthenticated())
        {
            Wallet.findById(req.params.id, (err, foundWallet) => {
                if(err)
                {
                    req.flash("error", "Wallets Not Found!");
                    res.redirect("back");
                }
                else
                {
                    //does user create the Wallet?
                    if(foundWallet.author.id.equals(req.user._id))
                    {
                        next();
                    }
                    else
                    {
                        req.flash("error", "You Don't have Permission to do that!");
                        res.redirect("back");
                    }             
                }
            });
        }
        else
        {
            req.flash("error", "Please Login First!");
            res.redirect("back");
        }
}

middlewareObj.checkCommentOwnership = function(req, res, next)
{
    //is user Logged in?
    if(req.isAuthenticated())
        {
            Comment.findById(req.params.comment_id, (err, foundComment) => {
                if(err)
                {
                    res.redirect("back");
                }
                else
                {
                    //does user create the Comment?
                    if(foundComment.author.id.equals(req.user._id))
                    {
                        next();
                    }
                    else
                    {
                        req.flash("error", "You Don't have Permission to do that!");
                        res.redirect("back");
                    }             
                }
            });
        }
        else
        {
            req.flash("error", "Please Login First!");
            res.redirect("back");
        }
}

middlewareObj.isLoggedin = function(req, res, next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
}



module.exports = middlewareObj;