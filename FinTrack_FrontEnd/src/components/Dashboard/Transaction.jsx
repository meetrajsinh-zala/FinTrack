import React from 'react';
import {Card, CardHeader, CardTitle} from '../ui/card';
import {Button} from '../ui/button';
import CountUp from 'react-countup';
import {Badge} from '../ui/badge';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import TransactionTable from './TransactionTable';

const Transaction = () => {
  return (
    <React.Fragment>
      <Card className="border-none shadow-none flex flex-col gap-4">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <Button className="bg-transparent text-zinc-800 border-2 hover:bg-[#4893ff] hover:text-white hover:border-[#4893ff] transition-all duration-300">
            View All
          </Button>
        </CardHeader>
        <div className="flex gap-4">
          <button className="font-medium text-muted-foreground pb-2 activeBank">
            KOTAK MAHINDRA BANK
          </button>
          <button className="font-medium text-muted-foreground pb-2">
            STATE BANK OF INDIA
          </button>
        </div>
      </Card>
      <Card className="bg-[#f5faff] shadow-none border-none">
        <div className="flex justify-between items-stretch px-5 py-4">
          <div className="flex items-stretch gap-5">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback className="bg-[#1570ef] text-white ">
                KB
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold text-[#194185]">
                KOTAK MAHINDRA BANK
              </h2>
              <h2 className="text-lg md:text-xl font-semibold text-[#1570ef]">
                <CountUp
                  end={1500}
                  prefix="₹ "
                  decimals={2}
                  decimal="."
                  duration={3}
                />
              </h2>
            </div>
          </div>
          <div>
            <Badge className="bg-[#e4fced] hover:bg-[#e4fced] text-[#198557] text-sm">
              saving
            </Badge>
          </div>
        </div>
      </Card>
      <TransactionTable />
    </React.Fragment>
  );
};

export default Transaction;
