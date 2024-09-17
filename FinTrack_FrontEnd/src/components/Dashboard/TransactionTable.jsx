import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";
import { useEffect } from "react";

const TransactionTable = ({ selectedBankId }) => {
  const token = localStorage.getItem("access_token");
  const [transactions, setTransactions] = useState(null);
  console.log(selectedBankId)
  
  const fetchTransections = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/Account/getTransections/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setTransactions(data["transactions"]);
        console.log(transactions);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const transfer = async () => {
    try {
      const response = await fetch("http://localhost:8000/Account/transfer/",{
        method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
      })
      if (response.ok) {
        const data = await response.json();
        setTransactions(data)
        console.log(data);
      }
    } catch (error) {
      console.log(err.message)
    }
  }
  useEffect(() => {
    // fetchTransections();
    transfer()
  }, []);
  return (
    <Table className="mt-3">
      <TableHeader>
        <TableRow className="bg-muted/50 text-slate-300 ">
          <TableHead>Transaction</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions?.transactions?.length > 0 ? (
          transactions.transactions.map(trans => {
            return (
              trans.source_account === selectedBankId && (
                <TableRow key={trans.id} className="hover:bg-transparent">
                  <TableCell className="text-zinc-700 font-medium">
                    {transactions.fname}
                  </TableCell>
                  <TableCell className="withdraw font-semibold">
                    - {trans.amount}.00
                  </TableCell>
                  <TableCell>
                    <Badge variant="process">• {trans.status}</Badge>
                  </TableCell>
                  <TableCell className="font-medium text-slate-500">
                    {new Date(trans.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              )
            )
          })
        ) : (
          <TableRow>
            <TableCell>No Transections</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TransactionTable;
