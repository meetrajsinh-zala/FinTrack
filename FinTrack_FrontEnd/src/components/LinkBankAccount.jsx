import React from 'react';
import Msg from './Msg';
import {Card, CardContent, CardHeader, CardTitle} from './ui/card';
import PlaidConnect from './PlaidConnect';
import {CircleArrowRight} from 'lucide-react';
import {useNavigate} from 'react-router-dom';

const LinkBankAccount = () => {
  const navigate = useNavigate ();
  const handleClick = () => {
    navigate ('/Dashboard');
  };
  return (
    <div className="flex h-screen justify-center items-center flex-col gap-2">
      <Card className="w-[30%] px-3 py-2 flex flex-col gap-6 items-center">
        <Msg
          Data={{
            Heading: 'Merge Your Bank',
            SubHeading: 'Add Your Bank To Manage Your Finance and more.',
          }}
        />
        <PlaidConnect />
      </Card>
      <button
        className="flex gap-2 items-center text-slate-400 hover:text-slate-800 transition-all duration-300"
        onClick={handleClick}
      >
        Skip <CircleArrowRight size={18} />
      </button>
    </div>
  );
};

export default LinkBankAccount;
