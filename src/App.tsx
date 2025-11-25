import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom"

import { AuthProvider, useAuth } from "@/contexts/auth"
import { DashboardLayout } from "@/pages/DashboardPage"
import { AppointmentsPage } from "@/pages/dashboard/AppointmentsPage"
import { DoctorsPage } from "@/pages/dashboard/DoctorsPage"
import { OverviewPage } from "@/pages/dashboard/OverviewPage"
import { RevenuePage } from "@/pages/dashboard/RevenuePage"
import { LiveMeetingsPage } from "@/pages/dashboard/LiveMeetingsPage"
import { TransactionsPage } from "@/pages/dashboard/TransactionsPage"
import { LoginPage } from "@/pages/LoginPage"

function ProtectedRoutes() {
  const { session } = useAuth()

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<OverviewPage />} />
              <Route path="doctors" element={<DoctorsPage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              {/* <Route path="revenue" element={<RevenuePage />} /> */}
              <Route path="live-meetings" element={<LiveMeetingsPage />} />
            </Route>
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
