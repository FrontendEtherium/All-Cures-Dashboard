export interface Appointment {
  appointmentId: number;
  docId: number;
  userId: number;
  appointmentDate: string; // ISO date-time string
  startTime: string; // "HH:mm" format
  endTime: string; // "HH:mm" format
  meetingLink: string | null;
  isPaid: boolean | null; // or you can keep it as `null | number` if backend uses numeric flags
  doctorName: string;
  userName: string;
  fee: number;
  Status: string; // could be union type like "Successfully Done" | "Pending" etc.
}

export interface AppointmentResponse {
  result: Appointment[];
  totalPages: number;
}

export interface AppointmentSummary {
  totalAppointments: number;
}

export interface AppointmentAnalytics {
  totalAppointments: number;
  successAppointments: number;
  failedAppointments: number;
  upcomingAppointments: number;
  paidAppointments: number;
  freeAppointments: number;
}
