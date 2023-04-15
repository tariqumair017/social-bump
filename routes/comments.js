const express    = require("express");
const router     = express.Router({mergeParams: true});
const comments   = require("../controllers/comments");
const asyncHandler = require("express-async-handler");   
const middleware = require("../middleware/index");


//Comments New
router.get("/new", middleware.isLoggedin, asyncHandler (comments.newComment));

//Comments Create
router.post("/", middleware.isLoggedin, middleware.validateComment, asyncHandler (comments.newCommentHandle));

//Comments Edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, asyncHandler (comments.editComment));

//Comments Update
router.put("/:comment_id", middleware.checkCommentOwnership, middleware.validateComment, asyncHandler (comments.updateComment));

//Comments Destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, asyncHandler (comments.destroyComment));


module.exports = router;