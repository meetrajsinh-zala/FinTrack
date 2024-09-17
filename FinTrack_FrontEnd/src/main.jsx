import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App, {RegisterAndLogout} from './App.jsx';
import './index.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LinkBankAccount from './components/LinkBankAccount.jsx';

const router = createBrowserRouter ([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/Login',
        element: <Login />,
      },
      {
        path: '/Signup',
        element: <RegisterAndLogout />,
      },
      {
        path: '/LinkYourBank',
        element: <LinkBankAccount />,
      },
      {
        path: '/Dashboard',
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
    ],
  },
]);

createRoot (document.getElementById ('root')).render (
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
