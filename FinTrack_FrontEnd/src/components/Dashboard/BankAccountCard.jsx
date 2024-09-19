import React from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import CountUp from "react-countup";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const BankAccountCard = ({ selectedAccount }) => {
  if (!selectedAccount) {
    return <p>Select a bank to see details.</p>;
  }
  const {
    institution_name = "Unknown",
    balances = { available: 0 },
    subtype = "Unknown",
  } = selectedAccount;
  return (
    <Card className="bg-[#f5faff] shadow-none border-none">
      <div className="flex justify-between items-stretch px-5 py-4">
        <div className="flex items-stretch gap-5">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback className="bg-[#1570ef] text-white ">
              {institution_name[0]}B
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-[#194185]">
              {institution_name}
            </h2>
            <h2 className="text-lg md:text-xl font-semibold text-[#1570ef]">
              <CountUp
                end={balances.available}
                prefix="$ "
                decimals={2}
                decimal="."
                duration={3}
              />
            </h2>
          </div>
        </div>
        <div>
          <Badge className="bg-[#e4fced] hover:bg-[#e4fced] text-[#198557] text-sm">
            {subtype}
          </Badge>
        </div>
      </div>
    </Card>
  );
};

export default BankAccountCard;
