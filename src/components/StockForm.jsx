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
          className="stock-form-button"
          style={{
            background: "linear-gradient(to right, var(--primary) 0%, var(--primary-foreground) 100%)",
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            transition: "all 0.2s ease-in-out",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
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
      <DialogContent className="stock-form-dialog">
        <DialogHeader>
          <DialogTitle className="stock-form-title">
            {editStock ? "Edit Stock" : "Add Stock to Portfolio"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="stock-form">
          <div className="form-field">
            <Label htmlFor="name">Stock Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Apple Inc."
              className="stock-input"
            />
          </div>
          <div className="form-field">
            <Label htmlFor="symbol">Stock Symbol</Label>
            <Input
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="AAPL"
              disabled={!!editStock}
              className="stock-input"
            />
          </div>
          <div className="form-field">
            <Label htmlFor="shares">Number of Shares</Label>
            <Input
              id="shares"
              type="number"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              placeholder="10"
              min="0"
              step="any"
              className="stock-input"
            />
          </div>
          <div className="form-field">
            <Label htmlFor="buyPrice">Buy Price</Label>
            <Input
              id="buyPrice"
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              placeholder="150.00"
              min="0"
              step="0.01"
              className="stock-input"
            />
          </div>
          <Button 
            type="submit" 
            className="submit-button"
            style={{
              width: "100%",
              marginTop: "1rem",
              background: "linear-gradient(to right, var(--primary) 0%, var(--primary-foreground) 100%)",
              color: "white",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              transition: "all 0.2s ease-in-out"
            }}
          >
            {editStock ? "Update Stock" : "Add Stock"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}