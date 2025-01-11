import React from "react";
import Feed from "../Feed";
import { Outlet } from "react-router-dom";
import RightSidebar from "../RightSidebar";

const Home = () => {
  return (
    <div className="flex">
      <div className="flex-grow">
        <Outlet />
        <Feed />
        <RightSidebar />
      </div>
    </div>
  );
};

export default Home;
