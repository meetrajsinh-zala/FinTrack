import React, { useEffect, useState } from "react";
import Msg from "../Msg";
import BankChart from "./BankChart";
import Transaction from "./Transaction";
import { useLocalStorage } from "react-use";
import axios from "axios";

const Body = () => {
  const token = localStorage.getItem("access_token");
  const [accounts, setAccounts] = useState(null);
  const fetchAccounts = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/Account/getAllAccounts/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      } else {
        console.error("Failed to fetch accounts:", response.statusText);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    console.log(accounts);
  }, [accounts]);

  const [user, setuser] = useLocalStorage("username");
  return (
    <div className="w-full md:max-w-[67%] border-r">
      <div className="px-4 md:px-6 pt-4 flex flex-col gap-3">
        <Msg
          Data={{
            Heading: `Welcome, ${user}`,
            SubHeading:
              "Access & Manage Your Account And Transactions Efficiently.",
          }}
        />
        <BankChart accounts={accounts || []} />
        <Transaction accounts={accounts || []} />
      </div>
    </div>
  );
};

export default Body;
