import React from 'react';
import Msg from '../Msg';
import PaymentForm from './PaymentForm';

const DashboardPayment = ({accounts}) => {
  return (
    <div className="w-full border-r">
      <div className="px-4 md:px-6 pt-4 flex flex-col gap-3">
        <Msg
          Data={{
            Heading: `Payment Transfer`,
            SubHeading: 'Please provide any specific details or notes related to the payment transfer',
          }}
        />
        <PaymentForm accounts={accounts || []} />
      </div>
    </div>
  );
};

export default DashboardPayment;
