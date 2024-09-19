import {Copy} from 'lucide-react';
import React from 'react';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreditCard = ({account}) => {
  const handleCopy = () => {
    navigator.clipboard
      .writeText (account.account_id)
      .then (() => {
        toast.success ('Account ID Is Copied...', {
          position: 'bottom-right',
        });
      })
      .catch (err => {
        toast.error ('Failed To Copy Account ID...', {
          position: 'bottom-right',
        });
      });
  };
  return (
    <div className="flex flex-col items-center gap-2">
      <ToastContainer />
      <div className="card relative h-[220px] w-[400px] flex flex-col justify-end px-6 py-10 text-white rounded-3xl gap-8 bg-gradient-to-r from-purple-500 to-pink-500">
        <div>
          <p className="text-2xl  font-medium">
            {account.institution_name}
          </p>
          <p className="text-2xl  font-medium">XXXX XXXX XXXX {account.mask}</p>
        </div>
        <div className="flex justify-between gap-10">
          {/* <p className="text-lg font-medium text-wrap">Elon Musk</p> */}
          <div className="flex-1 flex flex-col justify-end">
            <p className="self-end">Valid Date</p>
            <p className="self-end">XX/XX</p>
          </div>
          <div className="self-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 58 36"
              height="36"
              width="58"
            >
              <circle
                fill-opacity="0.62"
                fill="#F9CCD1"
                r="18"
                cy="18"
                cx="18"
              />
              <circle fill="#424242" r="18" cy="18" cx="40" opacity="0.36" />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <p className="text-zinc-500 text-sm">{account.account_id}</p>
        <button
          className="border p-1 rounded-md bg-slate-50 text-zinc-500 hover:text-zinc-800"
          onClick={handleCopy}
        >
          <Copy size={16} />
        </button>
      </div>
    </div>
  );
};

export default CreditCard;
