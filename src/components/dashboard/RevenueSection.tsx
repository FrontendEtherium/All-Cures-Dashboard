import { TrendingUp } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { RevenueSnapshot } from "@/data/dashboard"
import { formatCurrency } from "@/lib/format"

type RevenueSectionProps = {
  history: RevenueSnapshot[]
  currentRevenue: number
  conversionRate: number
}

export function RevenueSection({ history, currentRevenue, conversionRate }: RevenueSectionProps) {
  const latestChange = history.at(-1)?.change ?? 0
  const bestMonth = history.length
    ? history.reduce((acc, entry) => (entry.revenue > acc.revenue ? entry : acc), history[0])
    : undefined

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">Monthly revenue</CardTitle>
            <CardDescription>Performance trend across the previous 5 months.</CardDescription>
          </div>
          <TrendingUp className="size-6 text-primary" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold">{formatCurrency(currentRevenue)}</span>
            <Badge variant={latestChange >= 0 ? "success" : "warning"}>
              {latestChange >= 0 ? "+" : ""}
              {latestChange}% MoM
            </Badge>
          </div>
          <ul className="space-y-3 text-sm">
            {history.map((snapshot) => (
              <li
                key={snapshot.month}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="font-medium">{snapshot.month}</div>
                <div className="text-muted-foreground">
                  {formatCurrency(snapshot.revenue)}
                </div>
                <Badge variant={snapshot.change >= 0 ? "success" : "warning"}>
                  {snapshot.change >= 0 ? "+" : ""}
                  {snapshot.change}%
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Conversion insights</CardTitle>
          <CardDescription>Overview of patient journey efficiency.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="rounded-lg border p-4">
            <div className="text-muted-foreground">Best performing month</div>
            <div className="text-lg font-semibold">{bestMonth?.month ?? "--"}</div>
            <p className="text-muted-foreground">
              {bestMonth ? formatCurrency(bestMonth.revenue) : "Data will appear once revenue is recorded."}
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-muted-foreground">Current conversion rate</div>
            <div className="text-lg font-semibold">{conversionRate}%</div>
            <p className="text-muted-foreground">
              Percentage of consultations that convert into billed appointments.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
