import React from 'react';

const Msg = ({Data}) => {
  return (
    <div className="flex flex-col w-full justify-center">
      <h1 className="text-3xl font-medium pb-1">{Data.Heading}</h1>
      <p className="text-slate-600 font-normal">{Data.SubHeading}</p>
    </div>
  );
};

export default Msg;
