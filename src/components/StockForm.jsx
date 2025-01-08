import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
      setSymbol(editStock.symbol);
      setShares(editStock.shares.toString());
      setName(editStock.name || "");
      setBuyPrice(editStock.buyPrice?.toString() || "");
      setOpen(true);
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
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
          {editStock ? (
            <>
              <Edit className="w-4 h-4 mr-2" />
              Edit Stock
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add Stock
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            {editStock ? "Edit Stock" : "Add Stock to Portfolio"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Stock Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Apple Inc."
              className="bg-white/50 dark:bg-gray-800/50"
            />
          </div>
          <div>
            <Label htmlFor="symbol">Stock Symbol</Label>
            <Input
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="AAPL"
              disabled={!!editStock}
              className="bg-white/50 dark:bg-gray-800/50"
            />
          </div>
          <div>
            <Label htmlFor="shares">Number of Shares</Label>
            <Input
              id="shares"
              type="number"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              placeholder="10"
              min="0"
              step="any"
              className="bg-white/50 dark:bg-gray-800/50"
            />
          </div>
          <div>
            <Label htmlFor="buyPrice">Buy Price</Label>
            <Input
              id="buyPrice"
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              placeholder="150.00"
              min="0"
              step="0.01"
              className="bg-white/50 dark:bg-gray-800/50"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            {editStock ? "Update Stock" : "Add Stock"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}