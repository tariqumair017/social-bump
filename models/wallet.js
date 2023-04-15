const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Comment = require("./comment");


//Virtual Schema (For Thumbnail Virtual Property)
let ImagesSchema = new Schema({ 
    url: String,
    filename: String 
});

ImagesSchema.virtual("thumbnail").get(function() {
    return this.url.replace('/upload', '/upload/w_150');
});

let walletSchema = new Schema({
    name: String,
    price: Number,
    images: [ImagesSchema],
    description: String,
    location: String,
    author: {
        id: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

walletSchema.post("findOneAndDelete", async function(doc){
    if(doc)
    {
        await Comment.deleteMany({_id: {$in: doc.comments}})
    }
})

module.exports = mongoose.model("Wallet", walletSchema);