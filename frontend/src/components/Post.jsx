import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { FaRegHeart } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { FiSend } from "react-icons/fi";
import { FaRegBookmark } from "react-icons/fa";
import CommentDialog from "./CommentDialog";

const Post = ({post}) => {

  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const changeEventHandler = (e) =>{
   const inputText = e.target.value;
   if(inputText.trim()){
    setText(inputText)
   } else{
    setText("")
   }
  }

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={post.author?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>{post.author?.username}</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold"
            >
              Unfollow
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit ">
              Add to favourites
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit ">
              Delete
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={post.image}
        alt="post_image"
      />
      <div>
          <div className="flex items-center justify-between my-2">
            <div className="flex gap-2">
              <FaRegHeart className="cursor-pointer hover:text-gray-600" size={"22px"} />
              <FiMessageCircle className="cursor-pointer hover:text-gray-600" size={"22px"} 
              onClick={() => setOpen(true)}/>
              <FiSend size={"22px"}  />
            </div>
            <FaRegBookmark className="cursor-pointer hover:text-gray-600" size={"20px"} />
          </div>
        </div>
        <span className="font-medium block mb-2">{post.likes.length} likes</span>
        <p>
          <span className="font-medium mr-2">{post.author.username}</span>
          {post.caption}
        </p>
        <span onClick={() => setOpen(true)} className="cursor-pointer 
        text-sm text-gray-400">view all 10 comments</span>
        <CommentDialog open={open} setOpen={setOpen}/>
        <div className="flex items-center justify-between ">
          <input
          type="text"
          placeholder="Add a comment..."
          className="outline-none text-sm w-full"
          value={text}
          onChange={changeEventHandler}
          />
          {
            text &&  <span className="text-[#3BADF8]">Post</span>
          }
        </div>
    </div>
  );
};

export default Post;
