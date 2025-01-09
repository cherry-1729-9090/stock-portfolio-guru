import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit } from "lucide-react";

export function StockForm({ onSubmit, editStock = null }) {
  const [symbol, setSymbol] = useState("");
  const [shares, setShares] = useState("");
  const [name, setName] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (editStock) {
      setSymbol(editStock.symbol || "");
      setShares(editStock.quantity || "");
      setName(editStock.name || "");
      setBuyPrice(editStock.purchasePrice || "");
    }
  }, [editStock]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!symbol || !shares || !name || !buyPrice) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    onSubmit({ 
      symbol: symbol.toUpperCase(), 
      shares: Number(shares),
      name,
      buyPrice: Number(buyPrice)
    });
    setSymbol("");
    setShares("");
    setName("");
    setBuyPrice("");
    setOpen(false);
    toast({
      title: "Success",
      description: editStock ? "Stock updated successfully" : "Stock added to portfolio",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="default"
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 
                     text-white font-semibold px-6 py-3 rounded-lg shadow-lg 
                     transform transition-all duration-200 hover:scale-105 hover:shadow-xl
                     flex items-center gap-2 animate-fade-in"
        >
          {editStock ? (
            <>
              <Edit className="w-5 h-5" />
              Edit Stock
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Add Stock
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
            {editStock ? "Edit Stock" : "Add Stock to Portfolio"}
          </DialogTitle>
          <DialogDescription>
            {editStock 
              ? "Update the details of your stock holding."
              : "Enter the details of the stock you want to add to your portfolio."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Stock Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Apple Inc."
                className="w-full transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="symbol" className="text-sm font-medium">Stock Symbol</Label>
              <Input
                id="symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="AAPL"
                disabled={!!editStock}
                className="w-full transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shares" className="text-sm font-medium">Number of Shares</Label>
              <Input
                id="shares"
                type="number"
                value={shares}
                onChange={(e) => setShares(e.target.value)}
                placeholder="10"
                min="0"
                step="any"
                className="w-full transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buyPrice" className="text-sm font-medium">Buy Price</Label>
              <Input
                id="buyPrice"
                type="number"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                placeholder="150.00"
                min="0"
                step="0.01"
                className="w-full transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
          <Button 
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 
                       text-white font-semibold py-3 rounded-lg shadow-md
                       transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            {editStock ? "Update Stock" : "Add Stock"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}