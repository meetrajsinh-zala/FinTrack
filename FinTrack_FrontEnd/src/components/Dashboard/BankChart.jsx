import React from 'react';
import {Plus} from 'lucide-react';
import CountUp from 'react-countup';
import {Button} from '../ui/button';
import {Card} from '../ui/card';
import {Doughnut} from 'react-chartjs-2';
import {ArcElement, Chart, Legend, Tooltip} from 'chart.js';

Chart.register (ArcElement, Tooltip, Legend);

const BankChart = () => {
  const data = {
    labels: ['Bank 1', 'Bank 2', 'Bank 3'],
    datasets: [
      {
        label: 'Banks',
        data: [1205, 1500, 3295],
        backgroundColor: ['#0179fe', '#4893ff'],
      },
    ],
  };
  return (
    <Card>
      <div className="flex flex-col md:flex-row px-5 pb-3 pt-3 gap-10 items-start justify-between">
        <div className="flex items-center justify-center gap-10 md:w-auto">
          <div className="w-32">
            <Doughnut
              data={data}
              options={{
                cutout: '60%',
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </div>
          <div className="flex flex-col gap-4 text-center sm:text-left">
            <h2 className="font-semibold text-sm md:text-base">
              2 Bank Accounts
            </h2>
            <div>
              <p className="text-muted-foreground text-xs md:text-sm">
                Total Current Balance
              </p>
              <h2 className="text-lg md:text-xl">
                <CountUp
                  end={6000}
                  prefix="₹ "
                  decimals={2}
                  decimal="."
                  duration={3}
                />
              </h2>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-end md:justify-start md:w-auto mt-4 md:mt-0">
          <Button className="w-full md:w-auto px-3 py-2 gap-1 text-[#338eff] hover:text-[#1c284f] bg-transparent hover:bg-transparent transition-all duration-500">
            <Plus /> Connect Bank
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BankChart;
