import React, {useState} from 'react';
import Msg from '../Msg';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import TransactionTable from './TransactionTable';

const DashboardTranHist = ({accounts}) => {
  const [selectedAccount, setSelectedAccount] = useState (accounts[0] || null); // Default to the first account

  return (
    <div className="w-full border-r">
      <div className="px-4 md:px-6 pt-4">
        <div className="flex">
          <Msg
            Data={{
              Heading: `Transactions`,
              SubHeading: 'View All Your Previous Transactions...',
            }}
          />
          <Select
            onValueChange={value =>
              setSelectedAccount (
                accounts.find (account => account.account_id === value)
              )}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map ((account, idx) => (
                <SelectItem value={account.account_id} key={idx}>
                  {account.institution_name} Bank
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedAccount &&
          <Card className="flex flex-row justify-between items-center p-6 gap-2 text-white bg-[#1570ef] mt-4">
            <div>
              <CardHeader className="flex flex-col items-start mb-2">
                <CardTitle>{selectedAccount.institution_name}</CardTitle>
                <CardDescription className="text-white">
                  {selectedAccount.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex p-0">
                <p>XXXX XXXX XXXX {selectedAccount.mask}</p>
              </CardContent>
            </div>
            <div>
              <Card className="text-white bg-slate-200/30 border-none p-6">
                <CardHeader className="flex flex-col items-start">
                  <CardDescription className="text-white">
                    Current Balance
                  </CardDescription>
                  <CardTitle>${selectedAccount.balances.available}</CardTitle>
                </CardHeader>
              </Card>
            </div>
          </Card>}
        <TransactionTable selectedBankId={selectedAccount.account_id} />
      </div>
    </div>
  );
};

export default DashboardTranHist;
