import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import Navbar from './components/Navbar';
import SignUp from './components/SignUp';

const RegisterAndLogout = () => {
  localStorage.clear ();
  return <SignUp />;
};

const App = () => {
  return (
    <div className="w-full h-full">
      <Navbar />
      <Outlet />
      {!localStorage.getItem ('access_token') && <Navigate to={'Login'} />}
    </div>
  );
};

export default App;
export {RegisterAndLogout};
