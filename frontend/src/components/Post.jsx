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
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts } from "@/redux/postSlice";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.posts);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLiked, setPostLiked] = useState(post.likes.length);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postId) => postId?._id.toString() !== post?._id.toString()
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error);
    }
  };

  const likeOrDislikePostHandler = async() =>{
    try{
      const action = liked ? 'dislike' : 'like'
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedLikes = liked ? postLiked - 1 : postLiked + 1
        setPostLiked(updatedLikes)
        setLiked(!liked)
        //updating post 
        const updatedPostData = posts.map((p)=>p._id === post._id ? {
          ...p,
          likes : liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
        } : p)
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }

    } catch (error) {
      toast.error(error.response.data.message);
      console.error(error);
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
            {user && user?._id === post?.author._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit "
                onClick={deletePostHandler}
              >
                Delete
              </Button>
            )}
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
            <FaRegHeart
              className="cursor-pointer hover:text-gray-600"
              size={"22px"}
              onClick={likeOrDislikePostHandler}
            />
            <FiMessageCircle
              className="cursor-pointer hover:text-gray-600"
              size={"22px"}
              onClick={() => setOpen(true)}
            />
            <FiSend size={"22px"} />
          </div>
          <FaRegBookmark
            className="cursor-pointer hover:text-gray-600"
            size={"20px"}
          />
        </div>
      </div>
      <span className="font-medium block mb-2">{postLiked} likes</span>
      <p>
        <span className="font-medium mr-2">{post.author.username}</span>
        {post.caption}
      </p>
      <span
        onClick={() => setOpen(true)}
        className="cursor-pointer 
        text-sm text-gray-400"
      >
        view all 10 comments
      </span>
      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex items-center justify-between ">
        <input
          type="text"
          placeholder="Add a comment..."
          className="outline-none text-sm w-full"
          value={text}
          onChange={changeEventHandler}
        />
        {text && <span className="text-[#3BADF8]">Post</span>}
      </div>
    </div>
  );
};

export default Post;
