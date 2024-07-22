"use server";

import * as z from "zod";
import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { AUTH_ROUTES, DEFAULT_LOGIN_REDIRECT } from "@/routes";
import axios, { AxiosError } from "axios"
import { isRedirectError } from "next/dist/client/components/redirect";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  
  const validatedFields = LoginSchema.safeParse(values);
  
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  const response = await axios.post(AUTH_ROUTES.singIn, {
    email,
    password,
  });

  if (response.data?.error) {
    return response.data
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
    return { success: "Login Sucess!" };
  } catch (error: any) {

    if (isRedirectError(error)) throw error;

    if (error instanceof Error) {
      const { type, cause } = error as AuthError;
      switch (type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        case "CallbackRouteError":
          return cause?.err?.toString();
        default:
          return "Something went wrong.";
      }
    }

    throw error;
  }
};
