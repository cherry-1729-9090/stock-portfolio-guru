import React from 'react';
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockForm } from "@/components/StockForm";
import { StockTable } from "@/components/StockTable";
import { PortfolioChart } from "@/components/PortfolioChart";
import { LineChart } from "@/components/LineChart";
import { useToast } from "@/hooks/use-toast";
import { getStock, createStock } from "@/API/stocksAPI";
const POLLING_INTERVAL = 60000; // Poll every 60 seconds

const Index = () => {
  const [stocks, setStocks] = useState([]);
  const [editStock, setEditStock] = useState(null);
  const { toast } = useToast();

  const fetchStockPrice = async (id) => {
    try {
      return new Promise((resolve) => {
        getStock(id).then((data) => {
          resolve(data);
        });
      });
    } catch (error) {
      console.error("Error fetching stock price:", error);
      return null;
    }
  };

  const updatePrices = async () => {
    const updatedStocks = await Promise.all(
      stocks.map(async (stock) => {
        const price = await fetchStockPrice(stock._id);
        return price ? { ...stock, price } : stock;
      })
    );
    setStocks(updatedStocks);
    toast({
      title: "Updated",
      description: "Stock prices have been updated",
    });
  };

  // Set up polling interval
  useEffect(() => {
    // Initial update
    if (stocks.length > 0) {
      updatePrices();
    }

    // Set up polling interval
    const intervalId = setInterval(() => {
      if (stocks.length > 0) {
        updatePrices();
      }
    }, POLLING_INTERVAL);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [stocks.length]); // Dependency on stocks.length to restart polling when stocks are added/removed

  const handleSubmit = async ({ symbol, shares, name, buyPrice }) => {
    const price = await createStock(symbol, shares, buyPrice);

    if (!price) {
      toast({
        title: "Error",
        description: "Invalid stock symbol or API error",
        variant: "destructive",
      });
      return;
    }

    if (editStock) {
      setStocks(stocks.map((s) =>
        s.symbol === symbol ? { ...s, shares, name, buyPrice } : s
      ));
      setEditStock(null);
    } else {
      setStocks([...stocks, { symbol, shares, price, name, buyPrice }]);
    }

    toast({
      title: "Success",
      description: editStock ? "Stock updated successfully" : "Stock added successfully",
    });
  };

  const handleEdit = (stock) => {
    setEditStock(stock);
  };

  const handleDelete = (symbol) => {
    setStocks(stocks.filter((stock) => stock.symbol !== symbol));
    toast({
      title: "Success",
      description: "Stock removed from portfolio",
    });
  };

  const totalValue = stocks.reduce((sum, stock) => sum + stock.shares * stock.price, 0);
  const totalGain = stocks.reduce((sum, stock) => sum + (stock.shares * (stock.price - stock.buyPrice)), 0);
  const topStock = stocks.reduce(
    (max, stock) => {
      const value = stock.shares * stock.price;
      return value > max.value ? { symbol: stock.symbol, value } : max;
    },
    { symbol: "", value: 0 }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-10"
      style={{
        padding: '10px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '10px',
        }}
      >
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#000000',
            margin: '1rem',
            textAlign: 'center',
          }}
        >
          Portfolio Tracker
        </h1>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            padding: '10px',
          }}
        >
          <StockForm onSubmit={handleSubmit} editStock={editStock} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '10px',
        }}>
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-none shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold animate-number-change">
                ${totalValue.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-none shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${totalGain.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-none shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Top Holding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topStock.symbol}</div>
              <p className="text-xl font-bold text-muted-foreground">
                ${topStock.value.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
        }}>
          <PortfolioChart stocks={stocks} />
          <LineChart stocks={stocks} />
        </div>

        <div>
          <div>
            <h1
              style={{
                fontSize: '24px',
                margin: '1rem',
              }}
            >
              Portfolio Holdings
            </h1>
            <StockTable
              stocks={stocks}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;