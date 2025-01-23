import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { setPosts } from "@/redux/postSlice";
import { toast } from "sonner";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector((store) => store.posts);
  const [comment, setComment] = useState(selectedPost?.comments);
  const dispatch = useDispatch()

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  useEffect(() => {
    if(selectedPost) {
      setComment(selectedPost.comments)
    }
  },[selectedPost])

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${selectedPost._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);
        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id
            ? {
                ...p,
                comments: updatedCommentData,
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        setText("");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error);
    }
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogContent
          onInteractOutside={() => setOpen(false)}
          className="max-w-5xl p-0 flex flex-col"
        >
          <div className="flex flex-1">
            <div className="w-1/2">
              <img
                src={selectedPost?.image}
                alt="post_image"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="w-1/2 flex flex-col justify-between">
              <div className="flex items-center justify-between p-4">
                <div className=" flex gap-3 items-center">
                  <Link>
                    <Avatar>
                      <AvatarImage src={selectedPost?.author?.profilePicture} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link className="font-semibold text-xs">
                      {" "}
                      {selectedPost?.author?.username}
                    </Link>
                    {/* <span className="text-gray-600 text-sm">Bio...</span> */}
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <MoreHorizontal className="cursor-pointer" />
                  </DialogTrigger>
                  <DialogContent className="flex flex-col items-center text-sm text-center">
                    <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                      Unfollow
                    </div>
                    <div className="cursor-pointer w-full">
                      Add to favourites
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <hr />
              <div className="flex-1 overflow-y-auto max-h-96 p-4">
                comments section
                {comment.map((comment) => (
                  <Comment key={comment._id} comment={comment} />
                ))}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="w-full outline-none border text-sm border-gray-300 p-2 rounded"
                    value={text}
                    onChange={changeEventHandler}
                  />
                  <Button
                    disabled={!text}
                    variant="outline"
                    onClick={commentHandler}
                  >
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommentDialog;
