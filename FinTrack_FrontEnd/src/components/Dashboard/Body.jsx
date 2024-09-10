import React from 'react';
import Msg from '../Msg';
import BankChart from './BankChart';
import Transaction from './Transaction';
import {useLocalStorage} from 'react-use';

const Body = () => {
  const [user, setuser] = useLocalStorage ('username');
  return (
    <div className="w-full md:max-w-[67%] border-r">
      <div className="px-4 md:px-6 pt-4 flex flex-col gap-3">
        <Msg
          Data={{
            Heading: `Welcome, ${user}`,
            SubHeading: 'Access & Manage Your Account And Transactions Efficiently.',
          }}
        />
        <BankChart />
        <Transaction />
      </div>
    </div>
  );
};

export default Body;
