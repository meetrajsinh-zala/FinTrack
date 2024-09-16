import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  ReceiptText,
  CircleDollarSign,
  ArrowRightLeft,
} from "lucide-react";

const LeftSidebar = ({ selectedPage, setSelectedPage }) => {
  return (
    <div className="hidden border-r bg-muted/40 md:block h-screen">
      <div className="flex h-full max-h-screen flex-col gap-2 pt-4">
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              onClick={() => setSelectedPage("Home")}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              onClick={() => setSelectedPage("MyBank")}
            >
              <CircleDollarSign className="h-4 w-4" />
              My Bank
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              onClick={() => setSelectedPage("TransectionHist")}
            >
              <ReceiptText className="h-4 w-4" />
              Transaction History
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              onClick={() => setSelectedPage("PaymentTran")}
            >
              <ArrowRightLeft className="h-4 w-4" />
              Payment Transfer
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
