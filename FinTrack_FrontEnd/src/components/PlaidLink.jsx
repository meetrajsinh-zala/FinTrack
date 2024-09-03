import React from 'react';
import {Button} from './ui/button';

const PlaidLink = ({variant}) => {
  return (
    <React.Fragment>
      {variant === 'primary'
        ? <Button className="bg-[#1570ef] hover:bg-[#1570ef]/80">
            Connect Bank
          </Button>
        : variant === 'Ghost'
            ? <Button>Connect Bank</Button>
            : <Button>Connect Bank</Button>}
    </React.Fragment>
  );
};

export default PlaidLink;
