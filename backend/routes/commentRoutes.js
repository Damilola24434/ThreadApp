const express = require("express");
const Comment = require("../models/Comment");
const multer = require("multer");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("voiceNote"), async (req, res) => {
    const comment = new Comment({
        roomId: req.body.roomId,
        text: req.body.text,
        voiceNote: req.file ? req.file.path : null,
        emoji: req.body.emoji,
    });
    await comment.save();
    res.json(comment);
});

router.get("/:roomId", async (req, res) => {
    const comments = await Comment.find({ roomId: req.params.roomId });
    res.json(comments);
});

module.exports = router;
