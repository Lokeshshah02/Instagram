import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useRef } from "react";
import { readFileAsDataURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";

const CreatePost = ({ open, setOpen }) => {
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const {user} = useSelector(store => store.auth)
  const {posts} = useSelector(store=> store.posts)
  const imageRef = useRef();

  const dispatch = useDispatch()

  const fileChangeHandler = async (e) => {
    const file = e?.target?.files[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async () => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);
    try {
      setLoading(true)
      const res = await axios.post("http://localhost:8000/api/v1/post/addpost", formData,{
        headers : {
          'Content-Type' : 'multipart/form-data'
        },
        withCredentials : true
      });
      if(res.data.success){
        toast.success(res.data.message)
        dispatch(setPosts([res.data.post, ...posts]))
        setOpen(false)
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }finally{
      setLoading(false)
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => {
          setOpen(false), setImagePreview("");
        }}
      >
        <DialogHeader className="text-center font-semibold">
          Create New Post
        </DialogHeader>
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src="img" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs">{user?.username}</h1>
            <span className="text-gray-600 text-xs">Bio...</span>
          </div>
        </div>
        <Textarea
          className="focus-visible:ring-transparent border-none"
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        {imagePreview && (
          <div className="w-full h-fulll flex items-center justify-center">
            <img
              src={imagePreview}
              alt="prevImagePost"
              className="object-cover rounded-md h-full w-full"
            />
          </div>
        )}
        <input
          ref={imageRef}
          type="file"
          className="hidden"
          onChange={fileChangeHandler}
        />
        <Button
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto bg-[#0096F6] hover:bg-[#258bcf]"
        >
          Select from computer
        </Button>
        {imagePreview &&
          (loading ? (
            <Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin">
                Please wait
              </Loader2>
            </Button>
          ) : (
            <Button
              onClick={createPostHandler}
              type="submit"
              className="w-full"
            >
              Post
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
