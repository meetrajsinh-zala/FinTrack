import React from 'react';
import Body from './Body';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';

const Dashboard = () => {
  return (
    <div className="flex w-full pt-16 pb-4">
      <LeftSidebar />
      <Body />
      <RightSidebar />
    </div>
  );
};

export default Dashboard;
