import type { AppointmentResponse } from "@/types/appointment";
import api from "./axiosInstance";
interface Params {
  startDate: string; // ISODate like "2024-01-01"
  status?: number;
  offset: number;
  docId?: number;
}
export const getAppointments = async ({
  startDate,
  status,
  offset,
  docId,
}: Params) => {
  const {data} = await api.get<AppointmentResponse>(
    "/stats/appointments/success/list",
    {
      params: { startDate, status, offset, docId },
    }
  );
  return data;
};
