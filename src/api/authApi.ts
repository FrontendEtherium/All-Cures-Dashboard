import axios from "axios";
import { type LoginCredentials } from "@/contexts/auth";

const AUTH_URL = "https://uat.all-cures.com:444/cures/dashboard/login";

export const loginUser = async (credentials: LoginCredentials) => {
  try {
    const response = await axios.post(AUTH_URL, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
