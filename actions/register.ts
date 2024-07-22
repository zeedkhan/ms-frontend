"use server";

import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import axios from "axios";
import { AUTH_ROUTES } from "@/routes";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, name, password } = validatedFields.data;
  try {
    const response = await axios.post(AUTH_ROUTES.register, {
      name,
      email,
      password,
      domain: process.env.NEXT_PUBLIC_DOMAIN
    });
    if (response.data?.error) {
      return {
        error: response.data.error
      }
    }

    return { sucess: response.data.success };
  } catch (err: any) {
    return {
      error: err.response.data
    }
  }


};
