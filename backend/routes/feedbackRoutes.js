const router = require("express").Router();
const mongoose = require("mongoose");
const Feedback = require("../models/Feedback");
const User = require("../models/User");
const Comment = require("../models/Comments");


//get all feedbacks on the forum
router.get("/getallfeedbacks", async (req, res) => {
  let feedbacks;
  try {
    feedbacks = await Feedback.find().populate("user");
  } catch (err) {
    return console.log(err);
  }
  if (!feedbacks) {
    return res.status(404).json({ message: "No Feedbacks Found" });
  }
  return res.status(200).json({ feedbacks });
});


//retrieving user comments
router.get("/feedbacks/withcomments", async (req, res) => {
  let feedbacks;
  try {
    feedbacks = await Feedback.find().populate(["user", "comments"]);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
  if (!feedbacks) {
    return res.status(404).json({ message: "No comments Found" });
  }
  return res.status(200).json({ feedbacks });
});


//Adding comments
router.post("/feedbacks/:id/comments", async (req, res) => {
  const feedbackId = req.params.id;
  const { text, user } = req.body;

  let existingUser;
  try {
    existingUser = await User.findById(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }

  if (!existingUser) {
    return res.status(400).json({ message: "Unable To Find User By this ID" });
  }

  let feedback;
  try {
    feedback = await Feedback.findById(feedbackId).populate("user");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }

  if (!feedback) {
    return res.status(404).json({ message: "Feedback not found" });
  }

  const comment = new Comment({
    text,
    user,
  });

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await comment.save({ session });
    feedback.comments.push(comment);
    await feedback.save({ session });
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }

  return res.status(200).json({ comment });
});


//add Feedbacks to the forum
router.post("/addFeedback", async (req, res) => {
  const { title, description, user } = req.body;

  let existingUser;
  try {
    existingUser = await User.findById(user);
  } catch (err) {
    return console.log(err);
  }
  if (!existingUser) {
    return res.status(400).json({ message: "Unable To Find User By this ID" });
  }
  const feedback = new Feedback({
    title,
    description,
    user,
  });
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await feedback.save({ session });
    existingUser.feedbacks.push(feedback);
    await existingUser.save({ session });
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
  return res.status(200).json({ feedback });
});


// Update isApproved field to true for a specific feedback document
router.put('/approveFeedback/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    feedback.isApproved = true;
    await feedback.save();
    res.json(feedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



//Update feedbacks in the forum
router.put("/updateFeedback/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, image, user } = req.body;
  let feedback;
  try {
    feedback = await Feedback.findByIdAndUpdate(id, {
      title,
      description,
      user,
    });
  } catch (err) {
    return console.log(err);
  }
  if (!feedback) {
    return res.status(500).json({ message: "Unable To Update Feedback" + id });
  }
  return res.status(200).json({ feedback });
});

//Delete feedbacks in the forum
router.delete("/deleteFeedback/:id", async (req, res) => {
  const { id } = req.params;
  let feedback;
  try {
    feedback = await Feedback.findByIdAndRemove(id).populate("user");
    await feedback.user.feedbacks.pull(feedback);
    await feedback.user.save();
  } catch (err) {
    console.log(err);
  }
  if (!feedback) {
    return res.status(500).json({ message: "Unable To Delete" });
  }

  return res.status(200).json({ message: "Successfull Delete" });
});

//Get a user feedback
router.get("/fuser/:id", async (req, res) => {
  const userId = req.params.id;
  let userFeedbacks;
  try {
    userFeedbacks = await Feedback.find({ user: userId });
  } catch (err) {
    return console.log(err);
  }
  if (!userFeedbacks) {
    return res.status(404).json({ message: "No Feedback Found" });
  }
  return res.status(200).json({ user: userFeedbacks });
});

// Update isApproved field to true for a specific feedback document
router.put('/approveFeedback/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    feedback.isApproved = true;
    await feedback.save();
    res.json(feedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

//Report
router.get("/filter/:date", async (req, res) => {
  let feedbacks;
  const { date } = req.params;
  try {
    feedbacks = await Feedback.find({ createdAt: date });
  } catch (err) {
    return console.log(err);
  }
  if (!feedbacks) {
    return res.status(404).json({ message: "No Feedbacks Found" });
  }
  return res.status(200).json({ feedbacks });
});


module.exports = router;
