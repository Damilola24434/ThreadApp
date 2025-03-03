const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  name: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Room", RoomSchema);
