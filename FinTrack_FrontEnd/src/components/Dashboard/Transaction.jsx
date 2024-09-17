import React, {useState, useEffect} from 'react';
import {Card, CardHeader, CardTitle} from '../ui/card';
import {Button} from '../ui/button';
import TransactionTable from './TransactionTable';
import BankAccountCard from './BankAccountCard';

const Transaction = ({accounts}) => {
  const [selectedBank, setSelectedBank] = useState (null);
  const [selectedAccount, setSelectedAccount] = useState (null);
  const [selectedBankId, setSelectedBankId] = useState (null);

  const handleBankClick = (bankName, account_id) => {
    console.log (account_id);
    setSelectedBank (bankName);
    setSelectedBankId (account_id);
    const account = accounts.find (acc => acc.institution_name === bankName);
    setSelectedAccount (account);
  };

  useEffect (
    () => {
      if (accounts.length > 0) {
        setSelectedBank (accounts[0].institution_name);
        setSelectedAccount (accounts[0]);
        setSelectedBankId (accounts[0].account_id);
      }
    },
    [accounts]
  );

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
          {accounts.map ((account, index) => {
            const isSelected = selectedBank === account.institution_name;
            return (
              <button
                className={`font-medium text-muted-foreground pb-2 ${isSelected && 'activeBank'}`}
                key={index}
                onClick={() =>
                  handleBankClick (
                    account.institution_name,
                    account.account_id
                  )}
              >
                {account.institution_name} Bank
              </button>
            );
          })}
        </div>
      </Card>
      <BankAccountCard selectedAccount={selectedAccount} />
      <TransactionTable selectedBankId={selectedBankId} />
    </React.Fragment>
  );
};

export default Transaction;
