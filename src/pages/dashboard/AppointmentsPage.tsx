import { AppointmentsSection } from "@/components/dashboard/AppointmentsSection"
import { upcomingAppointments } from "@/data/dashboard"

export function AppointmentsPage() {
  return <AppointmentsSection appointments={upcomingAppointments} />
}

export default AppointmentsPage
