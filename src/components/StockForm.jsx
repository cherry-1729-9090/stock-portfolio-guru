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
          className="flex items-center gap-2 px-4 py-2 transition-all duration-200 ease-in-out hover:shadow-lg"
        >
          {editStock ? (
            <>
              <Edit className="w-4 h-4" />
              Edit Stock
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add Stock
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editStock ? "Edit Stock" : "Add Stock to Portfolio"}
          </DialogTitle>
          <DialogDescription>
            {editStock 
              ? "Update the details of your stock holding."
              : "Enter the details of the stock you want to add to your portfolio."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Stock Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Apple Inc."
              className="w-full"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="symbol">Stock Symbol</Label>
            <Input
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="AAPL"
              disabled={!!editStock}
              className="w-full"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="shares">Number of Shares</Label>
            <Input
              id="shares"
              type="number"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              placeholder="10"
              min="0"
              step="any"
              className="w-full"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="buyPrice">Buy Price</Label>
            <Input
              id="buyPrice"
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              placeholder="150.00"
              min="0"
              step="0.01"
              className="w-full"
            />
          </div>
          <Button 
            type="submit"
            className="w-full mt-6"
          >
            {editStock ? "Update Stock" : "Add Stock"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}