import React from 'react';
import Sidebar from './Sidebar';
import Body from './Body';

const Dashboard = () => {
  return (
    <div className="flex w-full pt-16 pb-4">
      <Sidebar />
      <Body />
    </div>
  );
};

export default Dashboard;
