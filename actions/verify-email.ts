"use server";

import { AUTH_ROUTES } from "@/routes";
import axios from "axios";

export const verifyEmail = async (token: string) => {
  const response = await axios.put(`${AUTH_ROUTES.verifyEmail}/${token}`)
  if (response.data.error) {
    return {
      error: response.data.error
    }
  }
  if (response.data.success) {
    return {
      success: response.data.success
    }
  }

  return {
    error: "Something went wrong!"
  }
};
