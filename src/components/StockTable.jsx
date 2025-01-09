import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export function StockTable({ stocks, onDelete, onEdit }) {
  console.log('Stocks in table:', stocks);
  
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Symbol</th>
            <th>Shares</th>
            <th>Buy Price</th>
            <th>Current Price</th>
            <th>Total Value</th>
            <th>Gain/Loss</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => {
            const currentPrice = stock.price.stockPrices;
            const purchasePrice = stock.price.purchasePrice;
            const shares = stock.price.quantity;
            
            const totalValue = shares * currentPrice;
            const gainLoss = shares * (currentPrice - purchasePrice);
            const gainLossPercentage = ((currentPrice - purchasePrice) / purchasePrice) * 100;
            
            return (
              <tr key={stock.symbol}>
                <td>{stock.name}</td>
                <td>{stock.symbol}</td>
                <td>{shares}</td>
                <td className="font-mono">
                  ${(purchasePrice).toFixed(2)}
                </td>
                <td className="font-mono">
                  ${currentPrice.toFixed(2)}
                </td>
                <td className="font-mono">
                  ${totalValue.toFixed(2)}
                </td>
                <td>
                  <span className={gainLoss >= 0 ? 'text-success' : 'text-error'}>
                    ${gainLoss.toFixed(2)}
                    <span className="text-sm">
                      ({gainLossPercentage.toFixed(2)}%)
                    </span>
                  </span>
                </td>
                <td className="flex gap-2">
                  <button
                    className="button button-ghost"
                    onClick={() => onEdit({
                      _id: stock.price._id,
                      symbol: stock.symbol,
                      quantity: shares,
                      purchasePrice: purchasePrice,
                      name: stock.name
                    })}
                  >
                    <Pencil className="text-primary" size={16} />
                  </button>
                  <button
                    className="button button-ghost"
                    onClick={() => onDelete(stock.price._id)}
                  >
                    <Trash2 className="text-error" size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}