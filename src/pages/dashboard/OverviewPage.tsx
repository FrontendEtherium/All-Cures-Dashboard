import { AppointmentsSection } from "@/components/dashboard/AppointmentsSection";
import { RevenueSection } from "@/components/dashboard/RevenueSection";
import { TransactionsSection } from "@/components/dashboard/TransactionsSection";
import {
  dashboardHighlights,
  recentTransactions,
  revenueHistory,
  upcomingAppointments,
} from "@/data/dashboard";

export function OverviewPage() {
  return (
    <div className="grid gap-4">
      <RevenueSection
        history={revenueHistory}
        currentRevenue={dashboardHighlights.monthlyRevenue}
        conversionRate={dashboardHighlights.conversionRate}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <AppointmentsSection appointments={upcomingAppointments} />
        <TransactionsSection transactions={recentTransactions} />
      </div>
    </div>
  );
}

export default OverviewPage;
