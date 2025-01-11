import React from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "../LeftSidebar";

const MainLayout = () => {
  return (
    <div>
      <LeftSidebar />
      {/* outlet lets the child render example the profile component */}

      <Outlet />
    </div>
  );
};

export default MainLayout;
