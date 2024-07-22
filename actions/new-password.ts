"use server";

import * as z from "zod";
import { NewPasswordSchema } from "@/schemas";
import axios from "axios";
import { AUTH_ROUTES } from "@/routes";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {

  if (!token) {
    return { error: "Missing token!" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validatedFields.data;

  const response = await axios.put(AUTH_ROUTES.changePassword + "/" + token, {
    password: password
  });

  if (response.data.error) {
    return {
      error: response.data.error
    }
  };

  return { success: response.data.success };
};
