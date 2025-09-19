import {
  type ComponentType,
  type SVGProps,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Activity,
  CalendarClock,
  CalendarRange,
  CheckCircle2,
  Loader2,
  Stethoscope,
  TrendingUp,
  XCircle,
} from "lucide-react";

import {
  getFailedAppointmentsSummary,
  getSuccessfulAppointmentsSummary,
} from "@/api/appointmentApi";
import { getAppointmentsAnalytics } from "@/api/appointmentApi";
import type { AppointmentAnalytics } from "@/types/appointment";
import { AppointmentsSection } from "@/components/dashboard/AppointmentsSection";
import { RevenueSection } from "@/components/dashboard/RevenueSection";
import { TransactionsSection } from "@/components/dashboard/TransactionsSection";
import { getDoctorsSummary } from "@/api/doctorApi";
import type { DoctorsSummary } from "@/types/doctor";
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
import { Button } from "@/components/ui/button";

const todayIso = new Date().toISOString().split("T")[0] as string;

export function OverviewPage() {
  const [summary, setSummary] = useState({ success: 0, failed: 0 });
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [analytics, setAnalytics] = useState<AppointmentAnalytics | null>(null);
  const [rangeLoading, setRangeLoading] = useState(false);
  const [rangeError, setRangeError] = useState<string | null>(null);
  const [doctorsSummary, setDoctorsSummary] = useState<DoctorsSummary | null>(
    null
  );
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [doctorsError, setDoctorsError] = useState<string | null>(null);

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
    let isActive = true;
    setRangeLoading(true);
    setDoctorsLoading(true);
    setRangeError(null);
    setDoctorsError(null);

    Promise.all([getAppointmentsAnalytics(), getDoctorsSummary()])
      .then(([apptAnalytics, docsSummary]) => {
        if (!isActive) return;
        setAnalytics(apptAnalytics);
        setDoctorsSummary(docsSummary);
      })
      .catch((err) => {
        console.error("Failed to load initial analytics", err);
        if (!isActive) return;
        setRangeError("Unable to load analytics.");
        setDoctorsError("Unable to load doctors summary.");
      })
      .finally(() => {
        if (!isActive) return;
        setRangeLoading(false);
        setDoctorsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const applyDateFilter = () => {
    if (!rangeStart || !rangeEnd) {
      setRangeError("Please select both start and end dates.");
      return;
    }
    if (new Date(rangeStart) > new Date(rangeEnd)) {
      setRangeError("Start date must be on or before end date.");
      return;
    }
    setRangeLoading(true);
    setDoctorsLoading(true);
    setRangeError(null);
    setDoctorsError(null);
    Promise.all([
      getAppointmentsAnalytics({ startDate: rangeStart, endDate: rangeEnd }),
      getDoctorsSummary({ startDate: rangeStart, endDate: rangeEnd }),
    ])
      .then(([apptAnalytics, docsSummary]) => {
        setAnalytics(apptAnalytics);
        setDoctorsSummary(docsSummary);
      })
      .catch((err) => {
        console.error("Failed to load analytics for range", err);
        setRangeError("Unable to load analytics for the selected range.");
        setDoctorsError(
          "Unable to load doctors summary for the selected range."
        );
        setAnalytics(null);
        setDoctorsSummary(null);
      })
      .finally(() => {
        setRangeLoading(false);
        setDoctorsLoading(false);
      });
  };

  const clearDateFilter = () => {
    setRangeStart("");
    setRangeEnd("");
    setRangeError(null);
    setDoctorsError(null);
    setRangeLoading(true);
    setDoctorsLoading(true);
    Promise.all([getAppointmentsAnalytics(), getDoctorsSummary()])
      .then(([apptAnalytics, docsSummary]) => {
        setAnalytics(apptAnalytics);
        setDoctorsSummary(docsSummary);
      })
      .catch((err) => {
        console.error("Failed to reload analytics", err);
        setRangeError("Unable to load analytics.");
        setDoctorsError("Unable to load doctors summary.");
      })
      .finally(() => {
        setRangeLoading(false);
        setDoctorsLoading(false);
      });
  };

  const totalAppointments = useMemo(
    () => summary.success + summary.failed,
    [summary.success, summary.failed]
  );

  const successRate = useMemo(() => {
    if (!totalAppointments) {
      return null;
    }
    return (summary.success / totalAppointments) * 100;
  }, [summary.success, totalAppointments]);

  const failedRate = useMemo(() => {
    if (!totalAppointments) {
      return null;
    }
    return (summary.failed / totalAppointments) * 100;
  }, [summary.failed, totalAppointments]);

  const upcomingShare = useMemo(() => {
    if (!analytics || !analytics.totalAppointments) {
      return null;
    }
    return (analytics.upcomingAppointments / analytics.totalAppointments) * 100;
  }, [analytics]);

  const rangeSuccessRate = useMemo(() => {
    if (!analytics || analytics.totalAppointments === 0) {
      if (!analytics) {
        return null;
      }
      return 0;
    }
    return (analytics.successAppointments / analytics.totalAppointments) * 100;
  }, [analytics]);

  const rangeFailedRate = useMemo(() => {
    if (!analytics || analytics.totalAppointments === 0) {
      if (!analytics) {
        return null;
      }
      return 0;
    }
    return (analytics.failedAppointments / analytics.totalAppointments) * 100;
  }, [analytics]);

  const signedCoverage = useMemo(() => {
    if (!doctorsSummary || !doctorsSummary.totalActiveDoctors) {
      return null;
    }
    if (doctorsSummary.totalActiveDoctors === 0) {
      return 0;
    }
    return (
      (doctorsSummary.totalSignedDoctors / doctorsSummary.totalActiveDoctors) *
      100
    );
  }, [doctorsSummary]);

  const analyticsMetrics = useMemo(
    () => [
      {
        icon: Activity,
        label: "Total",
        value:
          rangeLoading || !analytics
            ? "--"
            : analytics.totalAppointments.toLocaleString("en-IN"),
        description: "Appointments captured in range",
        isLoading: rangeLoading,
      },
      {
        icon: CheckCircle2,
        label: "Success",
        value:
          rangeLoading || !analytics
            ? "--"
            : analytics.successAppointments.toLocaleString("en-IN"),
        description: "Completed consultations",
        isLoading: rangeLoading,
      },
      {
        icon: XCircle,
        label: "Failed",
        value:
          rangeLoading || !analytics
            ? "--"
            : analytics.failedAppointments.toLocaleString("en-IN"),
        description: "Cancelled or missed slots",
        isLoading: rangeLoading,
      },
      {
        icon: CalendarClock,
        label: "Upcoming",
        value:
          rangeLoading || !analytics
            ? "--"
            : analytics.upcomingAppointments.toLocaleString("en-IN"),
        description: "Scheduled ahead",
        isLoading: rangeLoading,
      },
      {
        icon: Activity,
        label: "Paid",
        value:
          rangeLoading || !analytics
            ? "--"
            : analytics.paidAppointments.toLocaleString("en-IN"),
        description: "Completed with payment",
        isLoading: rangeLoading,
      },
      {
        icon: Activity,
        label: "Free",
        value:
          rangeLoading || !analytics
            ? "--"
            : analytics.freeAppointments.toLocaleString("en-IN"),
        description: "Complimentary visits",
        isLoading: rangeLoading,
      },
    ],
    [analytics, rangeLoading]
  );

  const rangeDescriptor = useMemo(() => {
    if (rangeStart && rangeEnd) {
      return `${rangeStart} → ${rangeEnd}`;
    }
    return "Live totals";
  }, [rangeStart, rangeEnd]);

  const lastUpdatedLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date()),
    []
  );

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            Operational overview
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor appointment throughput, conversion, and doctor coverage in
            one place.
          </p>
        </div>
        <div className="flex flex-col items-start gap-1.5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5">
            <CalendarRange className="size-4 text-primary" />
            <span>{rangeDescriptor}</span>
          </div>
          <span className="rounded-full bg-muted/60 px-3 py-1.5">
            Updated {lastUpdatedLabel}
          </span>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <HighlightMetric
          icon={Activity}
          label="Total appointments"
          value={
            summaryLoading
              ? "--"
              : totalAppointments.toLocaleString("en-IN")
          }
          isLoading={summaryLoading}
          hint="All-time tracked volume"
        />
        <HighlightMetric
          icon={TrendingUp}
          label="Success rate"
          value={
            summaryLoading || successRate === null
              ? "--"
              : `${successRate.toFixed(1)}%`
          }
          isLoading={summaryLoading}
          hint={
            summaryLoading || failedRate === null
              ? undefined
              : `${failedRate.toFixed(1)}% failed`
          }
          tone="positive"
        />
        <HighlightMetric
          icon={CalendarClock}
          label="Upcoming"
          value={
            rangeLoading || !analytics
              ? "--"
              : analytics.upcomingAppointments.toLocaleString("en-IN")
          }
          isLoading={rangeLoading}
          hint={
            rangeLoading || upcomingShare === null
              ? "Awaiting analytics"
              : `${upcomingShare.toFixed(1)}% of current pipeline`
          }
        />
        <HighlightMetric
          icon={Stethoscope}
          label="Active doctors"
          value={
            doctorsLoading || !doctorsSummary
              ? "--"
              : doctorsSummary.totalActiveDoctors.toLocaleString("en-IN")
          }
          isLoading={doctorsLoading}
          hint={
            doctorsLoading || signedCoverage === null
              ? "Network overview"
              : `${signedCoverage.toFixed(1)}% signed coverage`
          }
        />
      </section>
      {summaryError ? (
        <p className="text-sm text-destructive">{summaryError}</p>
      ) : null}

      <section className="grid gap-3 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Appointment performance</CardTitle>
            <CardDescription>
              Outcomes for the current selection with real-time refresh.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2.5 rounded-lg border bg-muted/40 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Status mix
              </p>
              <StatusRow
                label="Successful"
                count={
                  analytics?.successAppointments ?? summary.success ?? 0
                }
                percentage={rangeSuccessRate ?? successRate}
                isLoading={rangeLoading}
                tone="positive"
              />
              <StatusRow
                label="Failed"
                count={analytics?.failedAppointments ?? summary.failed ?? 0}
                percentage={rangeFailedRate ?? failedRate}
                isLoading={rangeLoading}
                tone="destructive"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {analyticsMetrics.map((metric) => (
                <MetricCard key={metric.label} {...metric} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="self-start">
          <CardHeader className="pb-3">
            <CardTitle>Date range filter</CardTitle>
            <CardDescription>
              Focus analytics on a specific reporting window.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="range-start">Start date</Label>
                <Input
                  id="range-start"
                  type="date"
                  value={rangeStart}
                  max={rangeEnd || todayIso}
                  onChange={(event) => setRangeStart(event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="range-end">End date</Label>
                <Input
                  id="range-end"
                  type="date"
                  value={rangeEnd}
                  min={rangeStart || undefined}
                  max={todayIso}
                  onChange={(event) => setRangeEnd(event.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={applyDateFilter}
                disabled={rangeLoading || doctorsLoading}
              >
                Apply
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={clearDateFilter}
                disabled={rangeLoading || doctorsLoading}
              >
                Clear
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Tip: leave the dates blank to return to the live view.
            </p>
            {rangeError ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 p-2.5 text-sm text-destructive">
                {rangeError}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Doctor coverage</CardTitle>
          <CardDescription>
            Track the depth of your physician network by specialty.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              icon={Activity}
              label="Total active doctors"
              value={
                doctorsLoading || !doctorsSummary
                  ? "--"
                  : doctorsSummary.totalActiveDoctors.toLocaleString("en-IN")
              }
              description="Logged in within the defined window"
              isLoading={doctorsLoading}
            />
            <MetricCard
              icon={Activity}
              label="Total signed doctors"
              value={
                doctorsLoading || !doctorsSummary
                  ? "--"
                  : doctorsSummary.totalSignedDoctors.toLocaleString("en-IN")
              }
              description="Doctors with active agreements"
              isLoading={doctorsLoading}
            />
            <MetricCard
              icon={TrendingUp}
              label="Signed coverage"
              value={
                doctorsLoading || signedCoverage === null
                  ? "--"
                  : `${signedCoverage.toFixed(1)}%`
              }
              description="Signed vs active ratio"
              isLoading={doctorsLoading}
            />
          </div>
          {doctorsError ? (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-2.5 text-sm text-destructive">
              {doctorsError}
            </div>
          ) : null}
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-left">
                  <th className="p-2.5 font-medium">Medicine type</th>
                  <th className="p-2.5 font-medium">Signed count</th>
                </tr>
              </thead>
              <tbody>
                {doctorsLoading ? (
                  <tr>
                    <td className="p-3" colSpan={2}>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" /> Loading…
                      </div>
                    </td>
                  </tr>
                ) : !doctorsSummary ||
                  doctorsSummary.signedByMedicineType?.length === 0 ? (
                  <tr>
                    <td className="p-3 text-muted-foreground" colSpan={2}>
                      No data available for the selected range.
                    </td>
                  </tr>
                ) : (
                  doctorsSummary.signedByMedicineType.map((row) => (
                    <tr key={row.medicineTypeName} className="border-t">
                      <td className="p-2.5 font-medium">{row.medicineTypeName}</td>
                      <td className="p-2.5">
                        {row.total.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* <RevenueSection
        history={revenueHistory}
        currentRevenue={dashboardHighlights.monthlyRevenue}
        conversionRate={dashboardHighlights.conversionRate}
      /> */}
      <div className="grid gap-3 lg:grid-cols-2">
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

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
  isLoading,
}: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pb-1.5 pt-3">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <Icon className="size-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-1.5">
        <div className="text-2xl font-semibold leading-tight">
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

interface HighlightMetricProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  hint?: string;
  isLoading?: boolean;
  tone?: "default" | "positive" | "warning";
}

function HighlightMetric({
  icon: Icon,
  label,
  value,
  hint,
  isLoading,
  tone = "default",
}: HighlightMetricProps) {
  const toneBackground: Record<NonNullable<HighlightMetricProps["tone"]>, string> = {
    default: "",
    positive:
      "border-emerald-200/60 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40",
    warning:
      "border-amber-200/60 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40",
  };

  const toneText: Record<NonNullable<HighlightMetricProps["tone"]>, string> = {
    default: "text-foreground",
    positive: "text-emerald-600 dark:text-emerald-400",
    warning: "text-amber-600 dark:text-amber-400",
  };

  const toneIcon: Record<NonNullable<HighlightMetricProps["tone"]>, string> = {
    default: "text-primary",
    positive: "text-emerald-600 dark:text-emerald-400",
    warning: "text-amber-600 dark:text-amber-400",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-background p-4 shadow-sm transition hover:shadow-md ${toneBackground[tone]}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <div className={`text-3xl font-semibold ${toneText[tone]}`}>
            {isLoading ? (
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            ) : (
              value
            )}
          </div>
        </div>
        <span className="rounded-full bg-muted/50 p-1.5">
          <Icon className={`size-5 ${toneIcon[tone]}`} />
        </span>
      </div>
      {hint ? (
        <p className="mt-3 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

interface StatusRowProps {
  label: string;
  count: number;
  percentage: number | null | undefined;
  isLoading?: boolean;
  tone?: "default" | "positive" | "destructive";
}

function StatusRow({
  label,
  count,
  percentage,
  isLoading,
  tone = "default",
}: StatusRowProps) {
  const resolvedPercentage =
    percentage === null || percentage === undefined ? null : percentage;
  const formattedPercentage = isLoading || resolvedPercentage === null
    ? "--"
    : `${resolvedPercentage.toFixed(1)}%`;
  const formattedCount = isLoading
    ? "--"
    : count.toLocaleString("en-IN");

  const barWidth = isLoading || resolvedPercentage === null
    ? "0%"
    : `${Math.min(100, Math.max(0, resolvedPercentage)).toFixed(1)}%`;

  const toneColor: Record<NonNullable<StatusRowProps["tone"]>, string> = {
    default: "bg-primary",
    positive: "bg-emerald-500",
    destructive: "bg-destructive",
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium">{label}</span>
          <span className="text-muted-foreground">{formattedCount}</span>
        </div>
        <span className="font-semibold text-muted-foreground">
          {formattedPercentage}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-muted">
        <div
          className={`h-1.5 rounded-full transition-all ${toneColor[tone]}`}
          style={{ width: barWidth }}
        />
      </div>
    </div>
  );
}
