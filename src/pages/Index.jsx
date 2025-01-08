import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockForm } from "@/components/StockForm";
import { StockTable } from "@/components/StockTable";
import { PortfolioChart } from "@/components/PortfolioChart";
import { LineChart } from "@/components/LineChart";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";
import finnhub from 'finnhub';

// Initialize Finnhub client
const getStoredApiKey = () => localStorage.getItem('FINNHUB_API_KEY');
const api = new finnhub.DefaultApi();

// Set the API key directly (in production, this should be handled more securely)
localStorage.setItem('FINNHUB_API_KEY', 'ctvdbspr01qh15ov61f0ctvdbspr01qh15ov61fg');
api.apiKey = 'ctvdbspr01qh15ov61f0ctvdbspr01qh15ov61fg';

const Index = () => {
  const [stocks, setStocks] = useState([]);
  const [editStock, setEditStock] = useState(null);
  const { toast } = useToast();

  const fetchStockPrice = async (symbol) => {
    try {
      return new Promise((resolve) => {
        if (!api.apiKey) {
          toast({
            title: "Error",
            description: "Please set your Finnhub API key",
            variant: "destructive",
          });
          resolve(null);
          return;
        }
        
        api.quote(symbol, (error, data) => {
          if (error) {
            console.error("Error fetching stock price:", error);
            resolve(null);
          } else {
            resolve(data.c); // Current price
          }
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

  const handleSubmit = async ({ symbol, shares, name, buyPrice }) => {
    const price = await fetchStockPrice(symbol);
    
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container py-12 space-y-12 px-4 mx-auto max-w-7xl"> {/* Increased spacing from 8 to 12 */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8"> {/* Increased gap from 6 to 8 */}
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Portfolio Tracker
          </h1>
          <StockForm onSubmit={handleSubmit} editStock={editStock} />
        </div>
        
        <div className="grid gap-10 md:grid-cols-3"> {/* Increased gap from 8 to 10 */}
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
              <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
              {totalGain >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
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

        <div className="grid gap-10 md:grid-cols-2"> {/* Increased gap from 8 to 10 */}
          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-200">
            <PortfolioChart stocks={stocks} />
          </Card>
          <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-200">
            <LineChart stocks={stocks} />
          </Card>
        </div>

        <div className="rounded-lg border bg-card shadow-lg hover:shadow-xl transition-all duration-200">
          <div className="p-8"> {/* Increased padding from 6 to 8 */}
            <h2 className="text-lg font-semibold mb-6"> {/* Increased margin from 4 to 6 */}
              Portfolio Holdings
            </h2>
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
