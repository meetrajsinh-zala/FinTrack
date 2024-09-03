import React from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useLocalStorage} from 'react-use';

const ProtectedRoute = ({children}) => {
  const [access_token, setaccess_token, removeaccess_token] = useLocalStorage (
    'access_token'
  );
  let location = useLocation ();

  if (!access_token) {
    return <Navigate to="/Login" state={{from: location}} replace />;
  }
  return children;
};

export default ProtectedRoute;
