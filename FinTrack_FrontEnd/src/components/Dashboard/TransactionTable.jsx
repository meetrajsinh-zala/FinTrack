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

const TransactionTable = ({ selectedBank }) => {
  const token = localStorage.getItem("access_token");
  const [transections, setTransections] = useState(null);
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
        setTransections(data);
        console.log(transections);
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    fetchTransections();
  }, []);
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
        {transections?.length > 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell className="text-zinc-700 font-medium">
              Alexa Doe
            </TableCell>
            <TableCell className="deposite font-semibold">- ₹500.00</TableCell>
            <TableCell>
              <Badge variant="process">• Processing</Badge>
            </TableCell>
            <TableCell className="font-medium text-slate-500">
              Wed 1:00 PM
            </TableCell>
            <TableCell>
              <Badge variant="outline_success">Deposite</Badge>
            </TableCell>
          </TableRow>
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
