import mongoose from "mongoose";

const conversationSchema = mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  message: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

export default conversationSchema = mongoose.model(
  "Conversation",
  conversationSchema
);
