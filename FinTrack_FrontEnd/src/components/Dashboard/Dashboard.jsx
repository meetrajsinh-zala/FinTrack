import React, { useState } from "react";
import Body from "./Body";
import LeftSidebar from "./LeftSidebar";

const Dashboard = () => {
  const [selectedPage, setSelectedPage] = useState("Home");
  return (
    <div className="flex w-full pt-16 pb-4">
      <LeftSidebar
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
      />
      <Body selectedPage={selectedPage} />
    </div>
  );
};

export default Dashboard;
