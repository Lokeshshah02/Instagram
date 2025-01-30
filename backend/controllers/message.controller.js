import Conversation from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const {textMessage :  message } = req.body;
    
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    
    //Estarablising the conversation if not started yet.
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages : []
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    // Push new message ID to conversation
    conversation.messages.push(newMessage._id); // Ensure messages exist in schema
    await conversation.save();

    //implement socket.io
    const receiverSocketId = getReceiverSocketId(receiverId)
    if(receiverSocketId){
      io.to(receiverSocketId).emit('newMessage', newMessage)
    }

    return res.status(201).json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getMessage = async (req, res) => {
  try {
    const senderId = req.id; 
    const receiverId = req.params.id;

    const conversation = await Conversation.findOne({
      participants:{$all: [senderId, receiverId]}
  }).populate('messages').exec();  

    if (!conversation) {
      return res.status(200).json({ success: true, messages: [] });
    }

    return res.status(200).json({ success: true, messages: conversation.messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


