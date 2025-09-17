import { RevenueSection } from "@/components/dashboard/RevenueSection"
import { dashboardHighlights, revenueHistory } from "@/data/dashboard"

export function RevenuePage() {
  return (
    <RevenueSection
      history={revenueHistory}
      currentRevenue={dashboardHighlights.monthlyRevenue}
      conversionRate={dashboardHighlights.conversionRate}
    />
  )
}

export default RevenuePage
