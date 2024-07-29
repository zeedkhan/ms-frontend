import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/schemas";
import axios from "axios";
import { AUTH_ROUTES } from "./routes";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const response = await axios.post(AUTH_ROUTES.singIn, { email, password });
          if (response.data?.error) {
            return null
          }
          if (response.data?.success) return response.data.success;
        }
        return null
      },
    }),
  ],
} satisfies NextAuthConfig;
