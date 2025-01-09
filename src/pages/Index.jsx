import React from 'react';
import { useState, useEffect } from "react";
import { StockForm } from "@/components/StockForm";
import { StockTable } from "@/components/StockTable";
import { PortfolioChart } from "@/components/PortfolioChart";
import { LineChart } from "@/components/LineChart";
import { useToast } from "@/hooks/use-toast";
import { getStock, createStock, updateStock, deleteStock, getAllStocks } from "@/API/stocksAPI";

const POLLING_INTERVAL = 60000;

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
    <div className="dashboard">
      <div className="container">
        <h1 className="portfolio-header">Portfolio Tracker</h1>
        
        <div className="stock-form-container">
          <StockForm onSubmit={handleSubmit} editStock={editStock} />
        </div>

        <div className="stats-grid">
          <div className="card stat-card">
            <div className="card-header">
              <h3 className="card-title text-sm">Total Value</h3>
            </div>
            <div className="card-content">
              <div className="text-lg font-bold animate-number-change">
                ${totalValue.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="card stat-card">
            <div className="card-header">
              <h3 className="card-title text-sm">Total Gain/Loss</h3>
            </div>
            <div className="card-content">
              <div className={`text-lg font-bold ${totalGain >= 0 ? 'text-success' : 'text-error'}`}>
                ${totalGain.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="card stat-card">
            <div className="card-header">
              <h3 className="card-title text-sm">Top Holding</h3>
            </div>
            <div className="card-content">
              <div className="text-lg font-bold">{topStock.symbol}</div>
              <p className="text-lg font-bold text-muted">
                ${topStock.value.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="charts-grid">
          <PortfolioChart stocks={stocks} />
          <LineChart stocks={stocks} />
        </div>

        <div className="portfolio-holdings">
          <h2 className="holdings-title">Portfolio Holdings</h2>
          <StockTable
            stocks={stocks}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
