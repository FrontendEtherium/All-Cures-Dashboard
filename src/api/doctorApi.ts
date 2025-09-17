import api from "./axiosInstance";

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
