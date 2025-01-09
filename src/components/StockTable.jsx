import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export function StockTable({ stocks, onDelete, onEdit }) {
  return (
    <div className="rounded-md border bg-white/50 dark:bg-gray-800/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50 dark:bg-gray-900/50">
            <TableHead>Name</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Shares</TableHead>
            <TableHead>Buy Price</TableHead>
            <TableHead>Current Price</TableHead>
            <TableHead>Total Value</TableHead>
            <TableHead>Gain/Loss</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stocks.map((stock) => {
            const totalValue = stock.shares * stock.price;
            const gainLoss = stock.shares * (stock.price - stock.buyPrice);
            const gainLossPercentage = ((stock.price - stock.buyPrice) / stock.buyPrice) * 100;
            
            const formattedPrice = typeof stock.price === 'number' 
              ? stock.price.toFixed(2) 
              : Number(stock.price).toFixed(2);
            
            return (
              <TableRow key={stock.symbol} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors">
                <TableCell className="font-medium">{stock.name}</TableCell>
                <TableCell>{stock.symbol}</TableCell>
                <TableCell>{stock.shares}</TableCell>
                <TableCell className="font-mono">${stock.buyPrice?.toFixed(2)}</TableCell>
                <TableCell className="font-mono">${formattedPrice}</TableCell>
                <TableCell className="font-mono">${totalValue.toFixed(2)}</TableCell>
                <TableCell>
                  <span className={`font-mono ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${gainLoss.toFixed(2)}
                    <span className="text-xs ml-1">
                      ({gainLossPercentage.toFixed(2)}%)
                    </span>
                  </span>
                </TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(stock)}
                    className="hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  >
                    <Pencil className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(stock.symbol)}
                    className="hover:bg-red-100 dark:hover:bg-red-900/30"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}