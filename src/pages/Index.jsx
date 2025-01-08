import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockForm } from "@/components/StockForm";
import { StockTable } from "@/components/StockTable";
import { PortfolioChart } from "@/components/PortfolioChart";
import { LineChart } from "@/components/LineChart";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";

const ALPHA_VANTAGE_API_KEY = "CQ5QLR5T43CF3QPV";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container py-8 space-y-8 px-4 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Portfolio Tracker
          </h1>
          <StockForm onSubmit={handleSubmit} editStock={editStock} />
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-none shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold animate-number-change">
                ${totalValue.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-none shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Number of Stocks</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stocks.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-none shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Top Holding</CardTitle>
              <Activity className="h-4 w-4 text-purple-600" />
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
          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-200">
            <PortfolioChart stocks={stocks} />
          </Card>
          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-200">
            <LineChart stocks={stocks} />
          </Card>
        </div>

        <div className="rounded-lg border bg-card shadow-lg hover:shadow-xl transition-all duration-200">
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
    </div>
  );
};

export default Index;