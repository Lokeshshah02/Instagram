import React from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useRef } from "react";

const CreatePost = ({ open, setOpen }) => {
  
const imageRef = useRef();

  const createPostHandler = (e) => {
    try {
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-center font-semibold">
          Create New Post
        </DialogHeader>
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src="img" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        <div>
          <h1 className="font-semibold text-xs">Username</h1>
          <span className="text-gray-600 text-xs">Bio...</span>
        </div>
        </div>
        <Textarea className="focus-visible:ring-transparent border-none" placeholder="Write a caption..."/>
        <input ref={imageRef} type="file" className="hidden"/>
        <Button onClick={() => imageRef.current.click()} className="w-fit mx-auto bg-[#0096F6] hover:bg-[#258bcf]">Select from computer</Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
