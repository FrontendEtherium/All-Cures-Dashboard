import { useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  BarChart3,
  CalendarCheck,
  Home,
  LogOut,
  Menu,
  Receipt,
  Search,
  UserCircle2,
} from "lucide-react";

import { AppSidebar, type AppSidebarItem } from "@/components/app-sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { useAuth } from "@/contexts/auth";

const navItems: AppSidebarItem[] = [
  {
    title: "Overview",
    description: "Latest metrics and insights",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Doctors",
    description: "Manage doctor profiles and availability",
    href: "/dashboard/doctors",
    icon: UserCircle2,
  },
  {
    title: "Appointments",
    description: "Review upcoming and past appointments",
    href: "/dashboard/appointments",
    icon: CalendarCheck,
  },
  {
    title: "Transactions",
    description: "Track recent invoice activity",
    href: "/dashboard/transactions",
    icon: Receipt,
  },
  {
    title: "Revenue",
    description: "Understand financial performance",
    href: "/dashboard/revenue",
    icon: BarChart3,
  },
];

export function DashboardLayout() {
  const location = useLocation();
  const { logout } = useAuth();

  const activeMeta = useMemo(() => {
    const match = navItems.find(
      (item) =>
        location.pathname === item.href ||
        location.pathname.startsWith(`${item.href}/`)
    );
    return match ?? navItems[0];
  }, [location.pathname]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted/20">
        <AppSidebar items={navItems} />
        <div className="flex flex-1 flex-col">
          <header className="flex flex-col gap-4 border-b bg-background/80 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3 lg:items-center">
              <SidebarTrigger className="lg:hidden">
                <Menu className="size-4" />
              </SidebarTrigger>
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {activeMeta.title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {activeMeta.description}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9 sm:w-64"
                  placeholder="Search records..."
                />
              </div>
              <Button variant="outline" onClick={logout} className="sm:w-auto">
                <LogOut className="size-4" />
                Sign out
              </Button>
              <Avatar>
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* <section className="grid gap-4 p-4 lg:grid-cols-4">
            <SummaryCard
              title="Monthly revenue"
              value={formatCurrency(dashboardHighlights.monthlyRevenue)}
              helper="Latest closed month"
            />
            <SummaryCard
              title="Active doctors"
              value={dashboardHighlights.activeDoctors.toString()}
              helper="Total onboarded"
            />
            <SummaryCard
              title="Patients"
              value={dashboardHighlights.totalPatients.toLocaleString()}
              helper="Lifetime unique patients"
            />
            <SummaryCard
              title="Conversion rate"
              value={`${dashboardHighlights.conversionRate}%`}
              helper="Consultations to billings"
            />
          </section> */}

          <main className="flex-1 space-y-4 p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default DashboardLayout;
