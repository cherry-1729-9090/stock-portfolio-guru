import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockForm } from "@/components/StockForm";
import { StockTable } from "@/components/StockTable";
import { PortfolioChart } from "@/components/PortfolioChart";
import { useToast } from "@/hooks/use-toast";

const ALPHA_VANTAGE_API_KEY = "demo"; // Replace with your API key

const Index = () => {
  const [stocks, setStocks] = useState([]);
  const { toast } = useToast();

  const fetchStockPrice = async (symbol) => {
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const data = await response.json();
      if (data["Global Quote"]) {
        return parseFloat(data["Global Quote"]["05. price"]);
      }
      throw new Error("Invalid stock symbol");
    } catch (error) {
      console.error("Error fetching stock price:", error);
      return null;
    }
  };

  const updatePrices = async () => {
    const updatedStocks = await Promise.all(
      stocks.map(async (stock) => {
        const price = await fetchStockPrice(stock.symbol);
        return price ? { ...stock, price } : stock;
      })
    );
    setStocks(updatedStocks);
  };

  useEffect(() => {
    const interval = setInterval(updatePrices, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [stocks]);

  const addStock = async ({ symbol, shares }) => {
    const price = await fetchStockPrice(symbol);
    if (price) {
      setStocks([...stocks, { symbol, shares, price }]);
    } else {
      toast({
        title: "Error",
        description: "Invalid stock symbol or API error",
        variant: "destructive",
      });
    }
  };

  const deleteStock = (symbol) => {
    setStocks(stocks.filter((stock) => stock.symbol !== symbol));
    toast({
      title: "Success",
      description: "Stock removed from portfolio",
    });
  };

  const totalValue = stocks.reduce((sum, stock) => sum + stock.shares * stock.price, 0);
  const topStock = stocks.reduce(
    (max, stock) => {
      const value = stock.shares * stock.price;
      return value > max.value ? { symbol: stock.symbol, value } : max;
    },
    { symbol: "", value: 0 }
  );

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Portfolio Tracker</h1>
      
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold animate-number-change">
              ${totalValue.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Number of Stocks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stocks.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Holding</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{topStock.symbol}</p>
            <p className="text-sm text-gray-500">
              ${topStock.value.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <PortfolioChart stocks={stocks} />
        <div className="space-y-4">
          <div className="flex justify-end">
            <StockForm onSubmit={addStock} />
          </div>
          <StockTable stocks={stocks} onDelete={deleteStock} />
        </div>
      </div>
    </div>
  );
};

export default Index;