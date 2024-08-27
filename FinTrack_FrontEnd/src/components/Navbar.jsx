import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Logo from '../assets/Logo.png';
import {useLocalStorage} from 'react-use';

const Navbar = () => {
  const [accessToken, setaccessToken] = useState (null);
  const [token, setToken, removeToken] = useLocalStorage ('access_token');
  const navigate = useNavigate ();

  const handleLogout = () => {
    // setaccessToken (null);
    removeToken ();
    navigate ('/Login');
  };

  useEffect (
    () => {
      setaccessToken (localStorage.getItem ('access_token'));
    },
    [localStorage.getItem ('access_token')]
  );

  return (
    <div className="flex flex-col">
      <header className="fixed top-0 z-10 w-full flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="flex justify-between w-full">
          <Link
            to={'/'}
            className="flex items-center gap-3 text-lg font-semibold md:text-base"
          >
            <img src={Logo} className="h-6 w-6" />
            <span className="text-[#1c284f] font-bold text-xl">FinTrack</span>
          </Link>
          {accessToken
            ? <button
                className="text-slate border border-zinc-400 px-5 rounded-full py-2 font-medium hover:bg-[#1c284f] hover:text-white hover:border-[#1c284f] transition-all duration-500"
                onClick={handleLogout}
              >
                Logout
              </button>
            : <div className="flex gap-4">
                <Link
                  to={'/Login'}
                  className="text-slate border border-zinc-400 px-5 rounded-full py-2 font-medium hover:bg-[#1c284f] hover:text-white hover:border-[#1c284f] transition-all duration-500"
                >
                  Login
                </Link>
                <Link
                  to={'/Signup'}
                  className="text-slate border border-zinc-400 px-5 rounded-full py-2 font-medium hover:bg-[#1c284f] hover:text-white hover:border-[#1c284f] transition-all duration-500"
                >
                  Signup
                </Link>
              </div>}
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
