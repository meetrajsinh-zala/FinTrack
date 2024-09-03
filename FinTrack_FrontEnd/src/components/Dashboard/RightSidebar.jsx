import React from 'react';
import {Card, CardHeader, CardTitle} from '../ui/card';
import {Progress} from '../ui/progress';
import {Plus} from 'lucide-react';

const RightSidebar = () => {
  return (
    <Card className="h-fit mt-5 px-4 py-3 w-full sm:w-[18%] flex flex-col gap-5 border-none shadow-none">
      <div className="flex justify-between items-center">
        <h3>My Budgets</h3>
        <button className="hover:bg-[#1570ef] rounded-full px-1 hover:text-white py-[0.1rem]">
          <Plus width={20} />
        </button>
      </div>
      <div className="flex flex-col justify-between gap-2">
        <div className="flex justify-between text-sm">
          <p className="text-[#054F31]">Saving</p>
          <p className="text-[#054F31]">₹ 500 left</p>
        </div>
        <Progress
          value={80}
          className="h-2 w-full"
          indicatorClass="bg-[#027A48] rounded-full"
        />
      </div>
      <div className="flex flex-col justify-between gap-2">
        <div className="flex justify-between text-sm">
          <p className="text-[#851651]">Food and booze</p>
          <p className="text-[#C11574]">₹ 1000 left</p>
        </div>
        <Progress
          value={33}
          className="h-2 w-full"
          indicatorClass="bg-[#C11574] rounded-full"
        />
      </div>
    </Card>
  );
};

export default RightSidebar;
