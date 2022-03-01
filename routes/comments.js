const express    = require("express");
const router     = express.Router();
const Wallet     = require("../models/wallet");
const Comment    = require("../models/comment");
const middleware = require("../middleware/index");

//Comments New
router.get("/wallets/:id/comments/new", middleware.isLoggedin, (req, res) => {
    //find the wallet with provided ID
    Wallet.findById(req.params.id, (err, find) => {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("comments/new", {find: find});
        }
    });
});

//Comments Create
router.post("/wallets/:id/comments", middleware.isLoggedin, (req, res) => {
    //find the wallet Using ID
    Wallet.findById(req.params.id, (err, findWallet) => {
        if(err)
        {
            console.log(err);
            res.redirect("/wallets");
        }
        else
        {
            Comment.create(req.body.comment, (err, newComment) => {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    //add id and username to comment
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    //save comment
                    newComment.save();
                    //Push newComment to comments DB
                    findWallet.comments.push(newComment);
                    findWallet.save();
                    req.flash("success", "Comment Added!");
                    res.redirect("/wallets/" + findWallet._id);
                }
            });
        }
    });
});

//Comments Edit
router.get("/wallets/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            res.render("comments/edit",  {find_id: req.params.id, comment: foundComment});
        }
    });
});

//Comments Update
router.put("/wallets/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            req.flash("success", "Comment Updated!");
            res.redirect("/wallets/" + req.params.id);
        }
    });
});

//Comments Delete
router.delete("/wallets/:id/comments/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            req.flash("success", "Comment Deleted!");
            res.redirect("/wallets/" + req.params.id);
        }
    });
});




module.exports = router;