import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Singup from "./components/Signup";
import Login from "./components/Login";
import Profile from "./components/Profile";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";

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
          path: "/profile",
          element: <Profile />,
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
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
