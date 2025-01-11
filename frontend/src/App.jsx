import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Singup from "./components/Signup";
import Login from "./components/Login";
import MainLayout from "./components/ui/MainLayout";
import { Home } from "lucide-react";
import Profile from "./components/Profile";

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
