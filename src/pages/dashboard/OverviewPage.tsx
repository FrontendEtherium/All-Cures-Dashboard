import {
  type ComponentType,
  type SVGProps,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Activity,
  CalendarRange,
  CheckCircle2,
  Loader2,
  XCircle,
} from "lucide-react";

import {
  getAppointmentsCount,
  getFailedAppointmentsSummary,
  getSuccessfulAppointmentsSummary,
} from "@/api/appointmentApi";
import { AppointmentsSection } from "@/components/dashboard/AppointmentsSection";
import { RevenueSection } from "@/components/dashboard/RevenueSection";
import { TransactionsSection } from "@/components/dashboard/TransactionsSection";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  dashboardHighlights,
  recentTransactions,
  revenueHistory,
} from "@/data/dashboard";

const todayIso = new Date().toISOString().split("T")[0] as string;
const startOfYearIso = new Date(new Date().getFullYear(), 0, 1)
  .toISOString()
  .split("T")[0] as string;

export function OverviewPage() {
  const [summary, setSummary] = useState({ success: 0, failed: 0 });
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const [rangeStart, setRangeStart] = useState(startOfYearIso);
  const [rangeEnd, setRangeEnd] = useState(todayIso);
  const [rangeCount, setRangeCount] = useState(0);
  const [rangeLoading, setRangeLoading] = useState(false);
  const [rangeError, setRangeError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    setSummaryLoading(true);
    setSummaryError(null);

    Promise.all([
      getSuccessfulAppointmentsSummary(),
      getFailedAppointmentsSummary(),
    ])
      .then(([success, failed]) => {
        if (!isActive) return;
        setSummary({
          success: success.totalAppointments ?? 0,
          failed: failed.totalAppointments ?? 0,
        });
      })
      .catch((err) => {
        console.error("Failed to load appointment summaries", err);
        if (!isActive) return;
        setSummary({ success: 0, failed: 0 });
        setSummaryError("Unable to load appointment summaries.");
      })
      .finally(() => {
        if (!isActive) return;
        setSummaryLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!rangeStart || !rangeEnd) {
      return;
    }

    if (new Date(rangeStart) > new Date(rangeEnd)) {
      setRangeError("Start date must be on or before end date.");
      setRangeCount(0);
      setRangeLoading(false);
      return;
    }

    let isActive = true;
    setRangeLoading(true);
    setRangeError(null);

    getAppointmentsCount({ startDate: rangeStart, endDate: rangeEnd })
      .then((data) => {
        if (!isActive) return;
        setRangeCount(data.totalAppointments ?? 0);
      })
      .catch((err) => {
        console.error("Failed to load appointment range count", err);
        if (!isActive) return;
        setRangeError("Unable to load appointments for the selected range.");
        setRangeCount(0);
      })
      .finally(() => {
        if (!isActive) return;
        setRangeLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [rangeStart, rangeEnd]);

  const totalAppointments = useMemo(
    () => summary.success + summary.failed,
    [summary.success, summary.failed],
  );

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Appointments snapshot</CardTitle>
          <CardDescription>
            Live counts for successful, failed, and total appointments.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <MetricCard
              icon={CheckCircle2}
              label="Successful appointments"
              value={summary.success.toLocaleString("en-IN")}
              description="All-time confirmed consultations"
              isLoading={summaryLoading}
            />
            <MetricCard
              icon={XCircle}
              label="Failed appointments"
              value={summary.failed.toLocaleString("en-IN")}
              description="Appointments that did not complete"
              isLoading={summaryLoading}
            />
            <MetricCard
              icon={Activity}
              label="Total tracked"
              value={totalAppointments.toLocaleString("en-IN")}
              description="Combined successful and failed"
              isLoading={summaryLoading}
            />
          </div>
          {summaryError ? (
            <p className="text-sm text-destructive">{summaryError}</p>
          ) : null}
          <div className="space-y-4 rounded-lg border p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Appointments between selected dates
                </p>
                <div className="text-2xl font-semibold">
                  {rangeLoading ? (
                    <Loader2 className="size-5 animate-spin text-muted-foreground" />
                  ) : rangeError ? (
                    "--"
                  ) : (
                    rangeCount.toLocaleString("en-IN")
                  )}
                </div>
              </div>
              <CalendarRange className="size-6 text-primary" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="range-start">Start date</Label>
                <Input
                  id="range-start"
                  type="date"
                  value={rangeStart}
                  max={rangeEnd}
                  onChange={(event) => setRangeStart(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="range-end">End date</Label>
                <Input
                  id="range-end"
                  type="date"
                  value={rangeEnd}
                  min={rangeStart}
                  max={todayIso}
                  onChange={(event) => setRangeEnd(event.target.value)}
                />
              </div>
            </div>
            {rangeError ? (
              <p className="text-sm text-destructive">{rangeError}</p>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <RevenueSection
        history={revenueHistory}
        currentRevenue={dashboardHighlights.monthlyRevenue}
        conversionRate={dashboardHighlights.conversionRate}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <AppointmentsSection />
        <TransactionsSection transactions={recentTransactions} />
      </div>
    </div>
  );
}

export default OverviewPage;

interface MetricCardProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  description?: string;
  isLoading?: boolean;
}

function MetricCard({ icon: Icon, label, value, description, isLoading }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <Icon className="size-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">
          {isLoading ? (
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          ) : (
            value
          )}
        </div>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
