import React, {useState} from 'react';
import {Input} from '../ui/input';
import {Button} from '../ui/button';
import {Card, CardDescription, CardHeader, CardTitle} from '../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Textarea} from '../ui/textarea';

const PaymentForm = ({accounts}) => {
  const [selectedAccount, setSelectedAccount] = useState ('');
  const [email, setEmail] = useState ('');
  const [accountNumber, setAccountNumber] = useState ('');
  const [amount, setAmount] = useState ('');
  const [loading, setLoading] = useState (false);
  const [transferNote, setTransferNote] = useState ('');
  const token = localStorage.getItem ('access_token');

  const handleAccountChange = value => {
    setSelectedAccount (value);
  };

  const handleSubmit = async e => {
    e.preventDefault ();
    setLoading (true);

    try {
      const response = await fetch (
        'http://localhost:8000/plaidapi/make-transaction/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify ({
            source_account: selectedAccount, // Ensure this is correct
            recipient_email: email, // Ensure this is correct
            recipient_account_number: accountNumber, // Ensure this is correct
            amount: parseFloat (amount), // Convert to number if necessary
            transfer_note: transferNote,
          }),
        }
      );

      const data = await response.json ();
      if (response.ok) {
        console.log ('Transaction Success:', data);
      } else {
        console.error ('Transaction Error:', data);
      }
    } catch (error) {
      console.error ('Error:', error);
    } finally {
      setLoading (false);
    }
  };

  return (
    <React.Fragment>
      <Card className="flex flex-row px-4 py-2 border-none shadow-none">
        <CardHeader className="flex flex-col items-start space-y-0">
          <CardTitle className="text-lg">Transefer Details</CardTitle>
          <CardDescription>Enter the details of the recipient</CardDescription>
        </CardHeader>
      </Card>
      <Card className="px-4 py-2 flex flex-col gap-6 border-none shadow-none">
        <div className="flex justify-between items-center gap-6">
          <div className="w-[30%] flex flex-col gap-1">
            <CardDescription>Select Source Bank</CardDescription>
            <CardDescription>
              Select the bank account you want to transfer funds from
            </CardDescription>
          </div>
          <div className="w-[70%]">
            <Select value={selectedAccount} onValueChange={handleAccountChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map (account => (
                  <SelectItem
                    key={account.account_id}
                    value={account.account_id}
                  >
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-between items-center gap-6">
          <div className="w-[30%] flex flex-col gap-1">
            <CardDescription>Transfer Note (Optional)</CardDescription>
            <CardDescription>
              Please provide any additional information or instructions related to the transfer
            </CardDescription>
          </div>
          <div className="w-[70%]">
            <Textarea
              onChange={e => setTransferNote (e.target.value)}
              value={transferNote}
            />
          </div>
        </div>
      </Card>
      <Card className="flex flex-row px-4 py-2 border-none shadow-none">
        <CardHeader className="flex flex-col items-start space-y-0">
          <CardTitle className="text-lg">Bank account details</CardTitle>
          <CardDescription>
            Enter the bank account details of the recipient
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="px-4 py-2 flex flex-col gap-6 border-none shadow-none">
        <div className="flex justify-between items-center gap-6">
          <div className="w-[30%] flex flex-col gap-1">
            <CardDescription>Recipient's Email Address</CardDescription>
          </div>
          <div className="w-[70%]">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail (e.target.value)}
              placeholder="EX: test@example.com"
              aria-label="Recipient's Email"
              required
            />
          </div>
        </div>
        <div className="flex justify-between items-center gap-6">
          <div className="w-[30%] flex flex-col gap-1">
            <CardDescription>Recipient's Bank Account Number</CardDescription>
          </div>
          <div className="w-[70%]">
            <Input
              id="account-number"
              type="text"
              value={accountNumber}
              onChange={e => setAccountNumber (e.target.value)}
              placeholder="HINT: Account ID"
              aria-label="Recipient's Bank Account Number"
              required
            />
          </div>
        </div>
        <div className="flex justify-between items-center gap-6">
          <div className="w-[30%] flex flex-col gap-1">
            <CardDescription>Amount</CardDescription>
          </div>
          <div className="w-[70%]">
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={e => setAmount (e.target.value)}
              placeholder="EX: 5.00"
              aria-label="Transfer Amount"
              required
            />
          </div>
        </div>
      </Card>
      <Card className="px-4 py-2 border-none shadow-none">
        <Button
          className="w-full bg-[#1570ef] hover:bg-[#1570ef]/85"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Transferring...' : 'Transfer Funds'}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default PaymentForm;
