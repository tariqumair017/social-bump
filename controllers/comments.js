const Wallet     = require("../models/wallet"); 
const Comment    = require("../models/comment");
const { model } = require("mongoose");

module.exports.newComment = async (req, res, next) => {
    //find the wallet with provided ID
    const find = await Wallet.findById(req.params.id);
    res.render("comments/new", { find });

}

module.exports.newCommentHandle = async (req, res, next) => {
    //find the wallet Using ID
    const findWallet = await Wallet.findById(req.params.id);
    const newComment = new Comment(req.body.comment);
    //add id and username to comment
    newComment.author.id = req.user._id;
    newComment.author.username = req.user.username;
    //save comment
    await newComment.save();
    //Push newComment to comments DB
    await findWallet.comments.push(newComment);
    await findWallet.save();
    req.flash("success", "Comment Added!");
    res.redirect(`/wallets/${findWallet._id}`);
}

module.exports.editComment = async (req, res, next) => {
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
}

module.exports.updateComment = async (req, res, next) => {
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
}

module.exports.destroyComment = async (req, res, next) => {
    await Wallet.findByIdAndUpdate(req.params.id, {$pull: {comments: req.params.comment_id}})
    await Comment.findByIdAndDelete(req.params.comment_id);
    req.flash("success", "Comment Deleted!");
    res.redirect("/wallets/" + req.params.id);
}