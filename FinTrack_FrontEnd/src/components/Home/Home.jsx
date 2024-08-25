import React from 'react';
import Dashboard from '../../assets/Dashboard.png';
import {Button} from '../ui/button';
import {Link} from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col gap-4 justify-center items-center pt-24 pb-4">
      <div>
        <h1 className="text-4xl font-bold text-center mb-2">
          Administer you finances <br /> without fuss
        </h1>
        <p className="text-center">In charge of your own administation.</p>
      </div>
      <div className="flex justify-center gap-4">
        <Button>Download FinTrack</Button>
        <Button className="bg-transparent text-slate-800 font-bold border border-slate-400 hover:text-white transition-all duration-500">
          <Link to={'Login'}>Try WEB Version</Link>
        </Button>
      </div>
      <img src={Dashboard} className="w-[80%] drop-shadow-md" />
    </div>
  );
};

export default Home;
