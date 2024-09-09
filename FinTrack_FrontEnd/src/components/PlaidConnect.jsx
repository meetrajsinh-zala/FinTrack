import {PlaidLink} from 'react-plaid-link';
import {useState, useEffect} from 'react';

function PlaidConnect () {
  const [linkToken, setLinkToken] = useState (null);

  // Function to fetch the link token from the backend
  const fetchLinkToken = async () => {
    try {
      const token = localStorage.getItem ('access_token');
      const response = await fetch (
        'http://localhost:8000/plaidapi/create_link_token/',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`, // JWT token from localStorage
          },
        }
      );

      if (response.ok) {
        const data = await response.json ();
        setLinkToken (data.link_token);
      } else {
        console.error ('Failed to fetch link token:', response.statusText);
      }
    } catch (error) {
      console.error ('Error fetching link token:', error);
    }
  };

  // Fetch link token on component mount
  useEffect (() => {
    fetchLinkToken ();
  }, []);

  // Handle success from Plaid
  const onSuccess = async (public_token, metadata) => {
    try {
      const response = await fetch (
        'http://localhost:8000/plaidapi/exchange_public_token/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem ('access_token')}`, // Ensure JWT token is sent for this request
          },
          body: JSON.stringify ({
            public_token,
            access_token: localStorage.getItem ('access_token'),
          }),
        }
      );

      if (response.ok) {
        const data = await response.json ();
        console.log ('Access Token:', data.access_token);
      } else {
        console.error ('Error exchanging public token:', response.statusText);
      }
    } catch (error) {
      console.error ('Error exchanging public token:', error);
    }
  };

  return (
    <div>
      {linkToken
        ? <PlaidLink
            token={linkToken}
            onSuccess={onSuccess}
            onExit={(error, metadata) =>
              console.log ('Exited:', error, metadata)}
          >
            Connect your bank
          </PlaidLink>
        : <p>Loading...</p>}
    </div>
  );
}

export default PlaidConnect;
