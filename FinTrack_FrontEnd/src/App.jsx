import React from 'react';
import {Outlet} from 'react-router-dom';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <div className="w-full h-full">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default App;
