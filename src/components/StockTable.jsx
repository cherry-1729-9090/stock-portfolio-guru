import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export function StockTable({ stocks, onDelete, onEdit }) {
  return (
    <div className="rounded-md border bg-white/50 dark:bg-gray-800/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50 dark:bg-gray-900/50">
            <TableHead>Symbol</TableHead>
            <TableHead>Shares</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stocks.map((stock) => (
            <TableRow key={stock.symbol} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors">
              <TableCell className="font-medium">{stock.symbol}</TableCell>
              <TableCell>{stock.shares}</TableCell>
              <TableCell className="font-mono">${stock.price.toFixed(2)}</TableCell>
              <TableCell className="font-mono">${(stock.shares * stock.price).toFixed(2)}</TableCell>
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}