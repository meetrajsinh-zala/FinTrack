import React from 'react';
import Msg from '../Msg';
import {Card, CardContent, CardDescription, CardHeader} from '../ui/card';
import CreditCard from './CreditCard';

const DashboardMyBank = ({accounts}) => {
  return (
    <div className="w-full border-r">
      <div className="px-4 md:px-6 pt-4 flex flex-col gap-3">
        <Msg
          Data={{
            Heading: `My Bank Accounts`,
            SubHeading: 'Effortlessly Manage Your Banking Activities',
          }}
        />
        <Card className="p-6 flex flex-col gap-2">
          <CardHeader>
            <CardDescription className="text-black font-medium">
              Your Cards
            </CardDescription>
          </CardHeader>
          <div className="flex gap-4 flex-wrap">
            {accounts.map (account => {
              return <CreditCard account={account} />;
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardMyBank;
