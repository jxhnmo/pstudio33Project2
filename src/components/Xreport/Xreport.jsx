import React from 'react';

const Xreport = ({ salesData }) => {
  return (
    <div>
      <h2>X-Report for Today</h2>
      <div>
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Employee Name</th>
              <th>Manager Status</th>
              <th>Cost</th>
              <th>Time of Transaction</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((data, index) => (
              <tr key={index}>
                <td>{data.transaction_id}</td>
                <td>{data.employee_name}</td>
                <td>{data.manager_status ? 'Yes' : 'No'}</td>
                <td>${parseFloat(data.cost).toFixed(2)}</td>
                <td>{new Date(data.purchase_time).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Xreport;