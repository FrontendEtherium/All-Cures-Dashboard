import { ReceiptIndianRupee } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/format"
import type { Transaction } from "@/data/dashboard"

export type TransactionsSectionProps = {
  transactions: Transaction[]
}

const statusVariant: Record<Transaction["status"], "success" | "warning" | "secondary"> = {
  Paid: "success",
  Pending: "warning",
  Refunded: "secondary",
}

export function TransactionsSection({ transactions }: TransactionsSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Transactions</CardTitle>
          <CardDescription>Latest payments processed by the platform.</CardDescription>
        </div>
        <ReceiptIndianRupee className="size-6 text-primary" />
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Processed</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.reference}</TableCell>
                <TableCell>{transaction.patient}</TableCell>
                <TableCell>{transaction.method}</TableCell>
                <TableCell>{formatDate(transaction.processedAt)}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(transaction.amount)}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={statusVariant[transaction.status]}>
                    {transaction.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
