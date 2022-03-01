const mongoose = require("mongoose");
const Wallet = require("./models/wallet");
const Comment = require("./models/comment");

let data = [
    {
      name: "Umair",
      img: "https://pixabay.com/get/g8b4a1d68d65ca355c976b4dcd1fb955daa9a2fbd99b8e00a0a3fcf3817d34dd183e0a1af251470cc5f04084759bf420d_340.jpg",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "Khan",
        img: "https://pixabay.com/get/g06d9590ced05136b9c6e76a7764e1988fb9fd61b6aef2ee8f16cf0073bddd1d8ed394ebe8c6e8eea9e3b399f645553d4_340.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "Shahzer",
        img: "https://pixabay.com/get/gce412a19291b3c38655ccfc5f9f4b991327e9e64e77e1c98332fea259a4939c8e383b0879eedd1180a30c0eaa155eafe_340.jpg",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    }
]


function seedDB(){
    Wallet.deleteMany({}, (err) => {
        if(err)
        {
            console.log(err);
        }
        console.log("Removed all Wallets");
        //Adding few wallets
        data.forEach(function(seed){
            Wallet.create(seed, (err, voilet) => {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    console.log("added a new Wallet");
                    //create a comment for each wallet
                    Comment.create(
                        {
                            text: "this is a great wallet",
                            author: "Mudaa"
                        }, (err, comment) => {
                            if(err)
                            {
                                console.log(err);
                            }
                            else
                            {
                                voilet.comments.push(comment);
                                voilet.save();
                                console.log("Created new comment");
                            }
                            
                        });
                }
            });
        });
    });

    
};

module.exports = seedDB;