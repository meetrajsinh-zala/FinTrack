import { PlaidLink } from "react-plaid-link";
import { useState, useEffect } from "react";
import { useLocalStorage } from "react-use";
import { useNavigate } from "react-router-dom";

function PlaidConnect() {
  const [linkToken, setLinkToken] = useState(null);
  const [username, setusername] = useLocalStorage("username");
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const fetchLinkToken = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/plaidapi/create_link_token/",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLinkToken(data.link_token);
      } else {
        console.error("Failed to fetch link token:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching link token:", error);
    }
  };

  // Fetch link token on component mount
  useEffect(() => {
    fetchLinkToken();
  }, []);

  // Handle success from Plaid
  const onSuccess = async (public_token, metadata) => {
    try {
      const response = await fetch(
        "http://localhost:8000/plaidapi/exchange_public_token/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            public_token,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Access Token:", data.access_token);
        navigate("/Dashboard");
      } else {
        console.error("Error exchanging public token:", response.statusText);
      }
    } catch (error) {
      console.error("Error exchanging public token:", error);
    }
  };

  return (
    <div className="w-full hover:text-[#1570ef] transition-all duration-300">
      {linkToken ? (
        <PlaidLink
          token={linkToken}
          onSuccess={onSuccess}
          onExit={(error, metadata) => console.log("Exited:", error, metadata)}
          className="w-full"
        >
          Connect your bank
        </PlaidLink>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default PlaidConnect;
