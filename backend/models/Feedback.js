const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },


  isApproved: {
    type: Boolean,
    default: false
  },

  comments: { 
    type: mongoose.Schema.Types.ObjectId, //comments
    ref: "Comment" },
    
  user: {
    type: mongoose.Schema.Types.ObjectId, //User 😊
    ref: "User",
    required: true,
  },
  date: {
    type: Date,  //setting the date for each feedback posted in the forum
 
    default: new Date(),
    required: true,
  },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;