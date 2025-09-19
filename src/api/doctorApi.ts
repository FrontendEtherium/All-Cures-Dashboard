import api from "./axiosInstance";
import type { DoctorsSummary } from "@/types/doctor";

export const getAvailableDoctors = async (
  offset: number = 0,
  medTypeID?: number
) => {
  let url = `/video/get/doctors?offset=${offset}`;
  if (medTypeID) {
    url += `&medTypeID=${medTypeID}`;
  }
  const { data } = await api.get(url);
  return data;
};

export const getDoctorsSummary = async (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  const query: Record<string, string> = {};
  if (params?.startDate) query.startDate = params.startDate;
  if (params?.endDate) query.endDate = params.endDate;
  const { data } = await api.get<DoctorsSummary>("/stats/doctors/summary", {
    params: query,
  });
  return data;
};
