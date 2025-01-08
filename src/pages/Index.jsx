import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockForm } from "@/components/StockForm";
import { StockTable } from "@/components/StockTable";
import { PortfolioChart } from "@/components/PortfolioChart";
import { LineChart } from "@/components/LineChart";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

const ALPHA_VANTAGE_API_KEY = "demo"; // Replace with your API key

const Index = () => {
  const [stocks, setStocks] = useState([]);
  const [editStock, setEditStock] = useState(null);
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
    const interval = setInterval(updatePrices, 60000);
    return () => clearInterval(interval);
  }, [stocks]);

  const handleSubmit = async ({ symbol, shares }) => {
    const existingStock = stocks.find((s) => s.symbol === symbol);
    const price = await fetchStockPrice(symbol);
    
    if (!price) {
      toast({
        title: "Error",
        description: "Invalid stock symbol or API error",
        variant: "destructive",
      });
      return;
    }

    if (existingStock && !editStock) {
      toast({
        title: "Error",
        description: "Stock already exists in portfolio",
        variant: "destructive",
      });
      return;
    }

    if (editStock) {
      setStocks(stocks.map((s) => 
        s.symbol === symbol ? { ...s, shares } : s
      ));
      setEditStock(null);
    } else {
      setStocks([...stocks, { symbol, shares, price }]);
    }
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
  const topStock = stocks.reduce(
    (max, stock) => {
      const value = stock.shares * stock.price;
      return value > max.value ? { symbol: stock.symbol, value } : max;
    },
    { symbol: "", value: 0 }
  );

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Portfolio Tracker</h1>
        <StockForm onSubmit={handleSubmit} editStock={editStock} />
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold animate-number-change">
              ${totalValue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Number of Stocks</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stocks.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Holding</CardTitle>
            <TrendingDown className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topStock.symbol}</div>
            <p className="text-xs text-muted-foreground">
              ${topStock.value.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PortfolioChart stocks={stocks} />
        <LineChart stocks={stocks} />
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Portfolio Holdings</h2>
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