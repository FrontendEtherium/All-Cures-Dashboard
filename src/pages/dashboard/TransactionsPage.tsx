import { TransactionsSection } from "@/components/dashboard/TransactionsSection"
import { recentTransactions } from "@/data/dashboard"

export function TransactionsPage() {
  return <TransactionsSection transactions={recentTransactions} />
}

export default TransactionsPage
