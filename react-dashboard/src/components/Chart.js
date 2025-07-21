import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../css/Chart.css';

const PIE_COLORS = {
  Ready: '#219150', // green
  'Document Pending': '#ff9800', // orange
  'Medical Pending': '#ffb74d', // light orange
  'Offer Accepted': '#ffa726', // orange accent
  'Offer Declined': '#ff7043', // deep orange
  Other: '#ffe0b2'
};

function getPieData(data) {
  const statusCount = {};
  data.forEach(item => {
    statusCount[item.status] = (statusCount[item.status] || 0) + 1;
  });
  return Object.entries(statusCount).map(([name, value]) => ({ name, value }));
}

const Chart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="chart-nodata">No data</div>;
  }

  const pieData = getPieData(data);

  return (
    <div className="chart-root">
      <div className="chart-pie-container">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
              {pieData.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={PIE_COLORS[entry.name] || PIE_COLORS.Other}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
