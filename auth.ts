import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import axios from "axios";
import { AUTH_ROUTES } from "./routes";
import { User, UserRole } from "./types";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      // get user from User Service
      const existingUser = (await axios.get(`${AUTH_ROUTES.user}/${user.id}`)).data;

      if (!existingUser) return false;

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        // @ts-ignore
        session.user.image = token.image
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser: User = await (await axios.get(`${AUTH_ROUTES.user}/${token.sub}`)).data

      if (!existingUser) return token;

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.image = existingUser.image

      return token;
    },
  },
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  ...authConfig,
});
