import React from 'react';
import ReactApexChart from 'react-apexcharts';

const Xreport = ({ salesData }) => {
  const chartOptions = {
    chart: {
      type: 'bar'
    },
    series: [{
      name: 'Sales',
      data: salesData
    }],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  };

  return (
    <div>
      <h2>X-Report</h2>
      <ReactApexChart options={chartOptions} series={chartOptions.series} type="bar" height={350} />
    </div>
  );
};

export default Xreport;
