import React, {useState, useEffect} from 'react';
import CountUp from 'react-countup';
// import {Button} from '../ui/button';
import {Card} from '../ui/card';
import {Doughnut} from 'react-chartjs-2';
import {ArcElement, Chart, Legend, Tooltip} from 'chart.js';
import PlaidConnect from '../PlaidConnect';

Chart.register (ArcElement, Tooltip, Legend);

const BankChart = ({accounts}) => {
  const [totalBalance, setTotalBalance] = useState (0);
  const [chartData, setChartData] = useState ({
    labels: [],
    datasets: [
      {
        label: 'Banks',
        data: [],
        backgroundColor: [],
      },
    ],
  });

  const generateColors = numColors => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const blueShade = `rgb(${Math.floor (Math.random () * 50)}, ${Math.floor (Math.random () * 50)}, ${150 + Math.floor (Math.random () * 105)})`; // Blue value between 150-255
      colors.push (blueShade);
    }
    return colors;
  };

  useEffect (
    () => {
      if (accounts && accounts.length > 0) {
        const balance = accounts.reduce (
          (acc, account) => acc + account.balances.available,
          0
        );
        setTotalBalance (balance);

        const labels = accounts.map (account => account.institution_name);
        const data = accounts.map (account => account.balances.available);
        const backgroundColor = generateColors (accounts.length);

        setChartData ({
          labels,
          datasets: [
            {
              label: 'Banks',
              data,
              backgroundColor,
            },
          ],
        });
      }
    },
    [accounts]
  );

  return (
    <Card>
      <div className="flex flex-col md:flex-row px-5 pb-3 pt-3 gap-10 items-start justify-between">
        <div className="flex items-center justify-center gap-10 md:w-auto">
          <div className="w-32">
            <Doughnut
              data={chartData}
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
              Bank Accounts : {accounts.length}
            </h2>
            <div>
              <p className="text-muted-foreground text-xs md:text-sm">
                Total Current Balance
              </p>
              <h2 className="text-lg md:text-xl">
                <CountUp
                  end={totalBalance}
                  prefix="$ "
                  decimals={2}
                  decimal="."
                  duration={3}
                />
              </h2>
            </div>
          </div>
        </div>
        <div className="w-full flex justify-end md:justify-start md:w-auto mt-4 md:mt-0">
          <PlaidConnect />
        </div>
      </div>
    </Card>
  );
};

export default BankChart;
