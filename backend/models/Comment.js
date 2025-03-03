const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  text: String,
  voiceNote: String,  // URL to voice recording
  emoji: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", CommentSchema);
