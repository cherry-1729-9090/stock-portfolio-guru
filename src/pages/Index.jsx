import React from 'react';
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockForm } from "@/components/StockForm";
import { StockTable } from "@/components/StockTable";
import { PortfolioChart } from "@/components/PortfolioChart";
import { LineChart } from "@/components/LineChart";
import { useToast } from "@/hooks/use-toast";
import { getStock, createStock, updateStock, deleteStock, getAllStocks } from "@/API/stocksAPI";
const POLLING_INTERVAL = 60000; // Poll every 600 seconds

const Index = () => {
  const [stocks, setStocks] = useState([]);
  const [editStock, setEditStock] = useState(null);
  const { toast } = useToast();

  const updatePrices = async () => {
    try {
      const stocksData = await getAllStocks();
      const formattedStocks = stocksData.map(stock => ({
        symbol: stock.symbol,
        name: stock.name || stock.symbol,
        price: {
          _id: stock._id,
          quantity: stock.quantity,
          purchasePrice: stock.purchasePrice,
          stockPrices: stock.stockPrices
        }
      }));
      setStocks(formattedStocks);
      toast({
        title: "Updated",
        description: "Stock prices have been updated",
      });
    } catch (error) {
      console.error('Error updating prices:', error);
      toast({
        title: "Error",
        description: "Failed to update stock prices",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    updatePrices();
  }, []); 

  useEffect(() => {
    const intervalId = setInterval(() => {
      updatePrices();
    }, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, []); 

  const handleSubmit = async ({ symbol, shares, name, buyPrice }) => {
    try {
      if (editStock) {
        // Handle update
        const updatedData = await updateStock(editStock._id, {
          symbol,
          quantity: shares,
          purchasePrice: buyPrice,
          name
        });

        const updatedStock = {
          symbol: updatedData.symbol,
          name: name,
          price: {
            _id: updatedData._id,
            quantity: updatedData.quantity,
            purchasePrice: updatedData.purchasePrice,
            stockPrices: updatedData.stockPrices,
          }
        };

        setStocks(stocks.map((s) =>
          s.price._id === editStock._id ? updatedStock : s
        ));
        setEditStock(null);
      } else {
        // Handle create
        const stockData = await createStock(symbol, shares, buyPrice);
        const newStock = {
          symbol: stockData.symbol,
          name: name,
          price: {
            _id: stockData._id,
            quantity: stockData.quantity,
            purchasePrice: stockData.purchasePrice,
            stockPrices: stockData.stockPrices,
          }
        };
        setStocks([...stocks, newStock]);
      }

      toast({
        title: "Success",
        description: editStock ? "Stock updated successfully" : "Stock added successfully",
      });
    } catch (error) {
      console.error('Error handling stock submission:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process stock",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (stock) => {
    setEditStock(stock);
  };

  const handleDelete = async (id) => {
    try {
      await deleteStock(id);
      setStocks(stocks.filter((stock) => stock.price._id !== id));
      toast({
        title: "Success",
        description: "Stock removed from portfolio",
      });
    } catch (error) {
      console.error('Error deleting stock:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete stock",
        variant: "destructive",
      });
    }
  };

  const totalValue = stocks.reduce((sum, stock) => 
    sum + (stock.price.quantity * stock.price.stockPrices), 0);

  const totalGain = stocks.reduce((sum, stock) => 
    sum + (stock.price.quantity * (stock.price.stockPrices - stock.price.purchasePrice)), 0);

  const topStock = stocks.reduce(
    (max, stock) => {
      const value = stock.price.quantity * stock.price.stockPrices;
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