import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";
import { useEffect } from "react";

const TransactionTable = ({ selectedBankId, Limit }) => {
  const token = localStorage.getItem("access_token");
  const [transactions, setTransactions] = useState(null);
  const fetchTransections = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/Account/getTransections/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
            body: JSON.stringify ({
              selectedBankId,
            }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const getTransaction = async () => {
    try {
      const response = await fetch("http://localhost:8000/Account/fetchTransaction/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify ({
          selectedBankId,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err.message);
    }

  }

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

    const displayedTransactions = Limit
      ? transactions?.slice(0, 5) || []
      : transactions || [];


  useEffect(() => {
    fetchTransections()
    getTransaction()
    // transfer()
  }, [selectedBankId]);
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
        {displayedTransactions?.length > 0 ? (
          displayedTransactions.map((trans,idx) => {
            return (
              (
                <TableRow key={idx} className="hover:bg-transparent">
                  <TableCell className="text-zinc-700 font-medium">
                    {trans.name}
                  </TableCell>
                  <TableCell className={`${trans.amount[0]==="-" ? "withdraw" : 'deposite'} font-semibold`}>
                   $ {trans.amount}
                  </TableCell>
                  <TableCell>
                    <Badge variant={`${trans.status === "Completed" ? 'success' : 'process'}`}>{trans.status}</Badge>
                  </TableCell>
                  <TableCell className="font-medium text-slate-500">
                    {trans.date}
                  </TableCell>
                  <TableCell>
                  <Badge variant={`${JSON.parse(trans.category.replace(/'/g, '"'))[0]}`}>{JSON.parse(trans.category.replace(/'/g, '"'))[0]}</Badge>
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
