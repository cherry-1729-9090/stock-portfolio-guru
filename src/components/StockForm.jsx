import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export function StockForm({ onSubmit, editStock = null }) {
  const [symbol, setSymbol] = useState("");
  const [shares, setShares] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (editStock) {
      setSymbol(editStock.symbol);
      setShares(editStock.shares.toString());
      setOpen(true);
    }
  }, [editStock]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!symbol || !shares) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    onSubmit({ symbol: symbol.toUpperCase(), shares: Number(shares) });
    setSymbol("");
    setShares("");
    setOpen(false);
    toast({
      title: "Success",
      description: editStock ? "Stock updated successfully" : "Stock added to portfolio",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          {editStock ? "Edit Stock" : "Add Stock"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editStock ? "Edit Stock" : "Add Stock to Portfolio"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="symbol">Stock Symbol</Label>
            <Input
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="AAPL"
              disabled={!!editStock}
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
            />
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
            {editStock ? "Update Stock" : "Add Stock"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}