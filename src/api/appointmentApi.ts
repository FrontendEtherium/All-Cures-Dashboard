import type {
  AppointmentResponse,
  AppointmentSummary,
} from "@/types/appointment";
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
  const { data } = await api.get<AppointmentResponse>(
    "/stats/appointments/success/list",
    {
      params: { startDate, status, offset, docId },
    }
  );
  return data;
};

export const getSuccessfulAppointmentsSummary = async () => {
  const { data } = await api.get<AppointmentSummary>(
    "/stats/appointments/summary/success"
  );
  return data;
};

export const getFailedAppointmentsSummary = async () => {
  const { data } = await api.get<AppointmentSummary>(
    "/stats/appointments/summary/failed"
  );
  return data;
};

export const getAppointmentsCount = async ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) => {
  const { data } = await api.get<AppointmentSummary>(
    "/stats/appointments/count",
    {
      params: { startDate, endDate },
    }
  );
  return data;
};
