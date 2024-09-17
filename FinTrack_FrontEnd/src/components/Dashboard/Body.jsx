import React, {useEffect, useState} from 'react';
import DashboardHome from './DashboardHome';
import DashboardTranHist from './DashboardTranHist';
import DashboardMyBank from './DashboardMyBank';
import DashboardPayment from './DashboardPayment';

const Body = ({selectedPage}) => {
  const token = localStorage.getItem ('access_token');
  const [accounts, setAccounts] = useState (null);
  const choosePage = () => {
    if (selectedPage === 'Home') {
      return <DashboardHome accounts={accounts || []} />;
    } else if (selectedPage === 'MyBank') {
      return <DashboardMyBank accounts={accounts || []} />;
    } else if (selectedPage === 'TransectionHist') {
      return <DashboardTranHist accounts={accounts || []} />;
    } else {
      return <DashboardPayment accounts={accounts || []} />;
    }
  };
  const fetchAccounts = async () => {
    try {
      const response = await fetch (
        'http://localhost:8000/Account/getAllAccounts/',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json ();
        setAccounts (data);
      } else {
        console.error ('Failed to fetch accounts:', response.statusText);
      }
    } catch (err) {
      console.log (err.message);
    }
  };

  useEffect (() => {
    fetchAccounts ();
  }, []);

  useEffect (
    () => {
      console.log (accounts);
    },
    [accounts]
  );

  return <React.Fragment>{choosePage ()}</React.Fragment>;
};

export default Body;
