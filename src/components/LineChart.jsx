import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from 'recharts';

const COLORS = ["#1E3A8A", "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD"];

export function LineChart({ stocks }) {
  // Create data points for the chart with timestamps
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

  // Custom tooltip to show detailed information
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const stockData = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-bold text-lg mb-2">{stockData.name}</p>
          <div className="space-y-1">
            <p className="text-sm">Current Price: ${stockData.price.toFixed(2)}</p>
            <p className="text-sm">Buy Price: ${stockData.buyPrice.toFixed(2)}</p>
            <p className="text-sm">Shares: {stockData.shares}</p>
            <p className="text-sm">Total Value: ${stockData.value.toFixed(2)}</p>
            <p className={`text-sm ${stockData.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              Profit/Loss: ${stockData.profit.toFixed(2)} ({stockData.profitPercentage}%)
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle>Stock Performance</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}