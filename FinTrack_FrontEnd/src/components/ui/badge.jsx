import * as React from 'react';
import {cva} from 'class-variance-authority';

import {cn} from '@/lib/utils';

const badgeVariants = cva (
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        outline_success: 'text-[#198557] border-2 border-[#198557] hover:text-[#198557]/80 hover:border-[#198557]/80',
        process: 'text-[#344054] bg-[#F2F4F7]',
        success: 'text-[#027A48] bg-[#ECFDF3]',
        decline: 'text-[#B42318] bg-[#FEF3F2]',
        Transfer: 'text-[#198557] border-2 border-[#198557] hover:text-[#198557]/80 hover:border-[#198557]/80',
        Payment: 'text-[#198557] border-2 border-[#198557] hover:text-[#198557]/80 hover:border-[#198557]/80',
        Travel: 'text-[#1570ef] border-2 border-[#1570ef] hover:text-[#1570ef]/80 hover:border-[#1570ef]/80',
        'Food and Drink': 'text-[#ec83be] border-2 border-[#ec83be] hover:text-[#ec83be]/80 hover:border-[#ec83be]/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({className, variant, ...props}) {
  return (
    <div className={cn (badgeVariants ({variant}), className)} {...props} />
  );
}

export {Badge, badgeVariants};
