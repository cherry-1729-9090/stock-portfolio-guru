import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from 'recharts';

const COLORS = ["#1E3A8A", "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD"];

export function LineChart({ stocks }) {
  const data = stocks.map((stock) => {
    const value = stock.shares * stock.price;
    const profit = stock.shares * (stock.price - stock.buyPrice);
    const profitPercentage = ((stock.price - stock.buyPrice) / stock.buyPrice) * 100;

    return {
      name: stock.symbol,
      value,
      price: stock.price,
      shares: stock.shares,
      profit,
      profitPercentage: profitPercentage.toFixed(2),
      buyPrice: stock.buyPrice,
    };
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const stockData = payload[0].payload;
      const price = typeof stockData.price === 'number' 
        ? stockData.price.toFixed(2) 
        : Number(stockData.price || 0).toFixed(2);

      return (
        <div className="card p-4">
          <p className="text-sm text-muted">{`Date: ${stockData.date}`}</p>
          <p className="text-sm font-semibold">{`Price: $${price}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card chart-container">
      <div className="card-header">
        <h3 className="card-title">Stock Performance</h3>
      </div>
      <div className="card-content">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#666' }}
              tickLine={{ stroke: '#666' }}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fill: '#666' }}
              tickLine={{ stroke: '#666' }}
              label={{ value: 'Price ($)', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fill: '#666' }}
              tickLine={{ stroke: '#666' }}
              label={{ value: 'Value ($)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {stocks.map((stock, index) => (
              <React.Fragment key={stock.symbol}>
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="price"
                  name={`${stock.symbol} Price`}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  dot={{ fill: COLORS[index % COLORS.length], r: 6 }}
                  activeDot={{ r: 8, strokeWidth: 2 }}
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="value"
                  name={`${stock.symbol} Value`}
                  fill={COLORS[index % COLORS.length]}
                  fillOpacity={0.1}
                  stroke={COLORS[index % COLORS.length]}
                  strokeDasharray="3 3"
                />
              </React.Fragment>
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}