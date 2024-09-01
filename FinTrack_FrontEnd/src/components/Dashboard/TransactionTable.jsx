import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {Badge} from '../ui/badge';

const TransactionTable = () => {
  return (
    <Table className="mt-3">
      <TableHeader>
        <TableRow className="bg-muted/50 text-slate-300 ">
          <TableHead>Transaction</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Category</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Alexa Doe</TableCell>
          <TableCell>- ₹500.00</TableCell>
          <TableCell><Badge variant="secondary">Processing</Badge></TableCell>
          <TableCell>Wed 1:00 PM</TableCell>
          <TableCell>
            <Badge variant="outline_success">
              Deposite
            </Badge>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default TransactionTable;
