const mongoose = require("mongoose");
//Model on the commenting part of the fedback post on the forum
const CommentSchema = new mongoose.Schema({
  text: { 
    type: String, 
    required: true
   },
  user: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: "User", required: true
     },
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
