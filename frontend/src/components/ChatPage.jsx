import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { Input } from "./ui/input";
import { FiMessageCircle } from "react-icons/fi";
import Messages from "./Messages";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

const ChatPage = () => {
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const {onlineUsers, messages} = useSelector(store=>store.chat)
  const dispatch = useDispatch();
  const [textMessage, setTexMessage] = useState("")

  const selectUserHandler = (user) => {        
    dispatch(setSelectedUser(user));
  };

  const sendMessagehandler = async(receiverId) =>{
    try{
      const res= await axios.post(`http://localhost:8000/api/v1/message/send/${receiverId}`, {textMessage},{
        headers : {
          'Content-Type' : 'application/json'
        },
        withCredentials : true,
      })
      if(res.data.success){        
        setTexMessage("")
        dispatch(setMessages([...messages, res.data.newMessage]))
      }

    }catch(error){
   console.error(error)
   toast.error(error.response?.data?.message)
    }
  }

  useEffect(() =>{
    return () =>{
      dispatch(setSelectedUser(null))
    }
  },[]);

  return (
    <div className="flex ml-[2%] h-screen">
      <section className="w-full md:w-1/4 my-8">
        <h1 className="font-bold mb-4 px-3 text-xl">{user?.username}</h1>
        <hr className="mb-4 border-gray-300" />
        <div className="overflow-y-auto h-[80vh]">
          {suggestedUsers?.map((sug) => {
            const isOnline = onlineUsers.includes(sug._id)
            return (
              <div
                key={sug._id}
                onClick={() => selectUserHandler(sug)}
                className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer"
              >
                <Avatar className="w-14 h-14">
                  <AvatarImage src={sug?.profilePicture} alt="post_image" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{sug?.username}</span>
                  <span
                    className={`text-xs font-bold ${
                      isOnline ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isOnline ? "online" : "offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {selectedUser ? (
        <section className="flex-1 border-l-gray-300 flex flex-col h-full">
          <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10">
            <Avatar>
              <AvatarImage
                src={selectedUser?.profilePicture}
                alt="profile_image"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span> {selectedUser?.username}</span>
            </div>
          </div>
          <Messages selectedUser={selectedUser}/>
          <div className="flex items-center p-4 border-t border-gray-300">
            <Input value={textMessage} onChange={(e) => setTexMessage(e.target.value)} type="text" className="flex-1 mr-2 focus-visible:ring-transparent"
            placeholder="Messages..."/>
            <Button onClick={() => sendMessagehandler(selectedUser?._id)}>Send</Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto">
            <FiMessageCircle className="w-32 h-32 my-4"/>
            <h1 className="font-medium text-xl">Your messages</h1>
            <span>Send messages to start a chat</span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
