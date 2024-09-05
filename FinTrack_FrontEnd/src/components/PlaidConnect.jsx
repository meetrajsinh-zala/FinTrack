import React, { useState } from "react";
import { Button } from "./ui/button";
import { PlaidLink } from "react-plaid-link";

const PlaidConnect = () => {
  const [publicToken, setpublicToken] = useState(null);

  const onSuccess = (public_token, metadata) => {
    setpublicToken(public_token);
    fetch("http://localhost:8000/api/exchange_public_token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ public_token }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Access Token:", data.access_token);
      });
  };
  return (
    <PlaidLink
      token={publicToken}
      onSuccess={onSuccess}
      onExit={(error, metadata) => console.log("Exited:", error, metadata)}
    >
      Connect Bank
    </PlaidLink>
  );
};

export default PlaidConnect;
