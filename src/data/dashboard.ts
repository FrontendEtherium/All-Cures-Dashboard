

export type Appointment = {
  id: string
  patient: string
  doctor: string
  scheduledAt: string
  type: "In-person" | "Virtual"
  status: "Confirmed" | "Pending" | "Completed"
}

export type Transaction = {
  id: string
  reference: string
  patient: string
  amount: number
  status: "Paid" | "Refunded" | "Pending"
  method: "Card" | "UPI" | "Cash"
  processedAt: string
}

export type RevenueSnapshot = {
  month: string
  revenue: number
  change: number
}

export const doctorDirectory: Doctor[] = [
  {
    id: "doc-01",
    name: "Dr. Julia Smith",
    specialty: "Cardiology",
    location: "New Delhi",
    availability: "Mon - Thu",
    patients: 128,
  },
  {
    id: "doc-02",
    name: "Dr. Aarav Mehta",
    specialty: "Neurology",
    location: "Mumbai",
    availability: "Tue - Fri",
    patients: 96,
  },
  {
    id: "doc-03",
    name: "Dr. Kavya Sharma",
    specialty: "Dermatology",
    location: "Bengaluru",
    availability: "Wed - Sat",
    patients: 142,
  },
  {
    id: "doc-04",
    name: "Dr. Vikas Patel",
    specialty: "Orthopedics",
    location: "Chennai",
    availability: "Mon - Wed",
    patients: 87,
  },
]

export const upcomingAppointments: Appointment[] = [
  {
    id: "apt-4512",
    patient: "Ananya Gupta",
    doctor: "Dr. Julia Smith",
    scheduledAt: "2025-02-02T09:30:00Z",
    type: "In-person",
    status: "Confirmed",
  },
  {
    id: "apt-4513",
    patient: "Rohit Kumar",
    doctor: "Dr. Aarav Mehta",
    scheduledAt: "2025-02-02T11:15:00Z",
    type: "Virtual",
    status: "Pending",
  },
  {
    id: "apt-4514",
    patient: "Simran Kaur",
    doctor: "Dr. Kavya Sharma",
    scheduledAt: "2025-02-02T14:00:00Z",
    type: "In-person",
    status: "Confirmed",
  },
  {
    id: "apt-4515",
    patient: "Aditya Rao",
    doctor: "Dr. Julia Smith",
    scheduledAt: "2025-02-02T16:30:00Z",
    type: "Virtual",
    status: "Pending",
  },
]

export const recentTransactions: Transaction[] = [
  {
    id: "txn-9023",
    reference: "INV-23981",
    patient: "Priya Sharma",
    amount: 2200,
    status: "Paid",
    method: "Card",
    processedAt: "2025-01-30T08:45:00Z",
  },
  {
    id: "txn-9024",
    reference: "INV-23982",
    patient: "Sameer Khan",
    amount: 1450,
    status: "Pending",
    method: "UPI",
    processedAt: "2025-01-30T09:20:00Z",
  },
  {
    id: "txn-9025",
    reference: "INV-23983",
    patient: "Neha Agarwal",
    amount: 3180,
    status: "Paid",
    method: "Card",
    processedAt: "2025-01-30T10:15:00Z",
  },
  {
    id: "txn-9026",
    reference: "INV-23984",
    patient: "Rahul Verma",
    amount: 830,
    status: "Refunded",
    method: "Cash",
    processedAt: "2025-01-29T17:05:00Z",
  },
]

export const revenueHistory: RevenueSnapshot[] = [
  { month: "Sep", revenue: 540000, change: 8.4 },
  { month: "Oct", revenue: 585000, change: 6.2 },
  { month: "Nov", revenue: 612500, change: 4.1 },
  { month: "Dec", revenue: 654200, change: 5.8 },
  { month: "Jan", revenue: 698400, change: 6.7 },
]

export const dashboardHighlights = {
  totalPatients: 3124,
  activeDoctors: doctorDirectory.length,
  monthlyRevenue: revenueHistory[revenueHistory.length - 1]?.revenue ?? 0,
  conversionRate: 42.3,
}
