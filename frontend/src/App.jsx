import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Singup from "./components/Signup";
import Login from "./components/Login";
import Profile from "./components/Profile";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/notificationSlice";

function App() {
  const browserRouter = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile/:id",
          element: <Profile />,
        },
        {
          path: "/account/edit",
          element: <EditProfile />,
        },
        {
          path: "/chat",
          element: <ChatPage />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Singup />,
    },
  ]);

  const { user } = useSelector((store) => store.auth);
  const { socket } = useSelector((store) => store.socketio);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
       const socketio = io("http://localhost:8000", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      });
      dispatch(setSocket(socketio));

      //listen all the user events
      socketio.on("getOnlineUsers", (onlineUsers) => {        
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on('notification',(notification) => {
        dispatch(setLikeNotification(notification))
      })

      return () => {
        if (socketio) {
          socketio.close(); 
          dispatch(setSocket(null));
        }
      };
    } 
    else if(socket) {
        socket.close(); 
        dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
