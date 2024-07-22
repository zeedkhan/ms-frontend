"use server";

import * as z from "zod";
import { SettingsSchema } from "@/schemas";
import { currentUser } from "@/lib/auth";

const debug = true

export const settings = async (values: z.infer<typeof SettingsSchema>): Promise<{
  success?: string
  error?: string
}> => {
  const user = await currentUser();

  if (debug) {
    return { error: "Unauthorized!" };
  }



  // if (!user) {
  //   return { error: "Unauthorized!" };
  // }

  // const dbUser = await getUserById(user.id);

  // if (!dbUser) {
  //   return { error: "Unauthorized!" };
  // }

  // if (values.email && values.email !== user.email) {
  //   const existingUser = await getUserByEmail(values.email);

  //   if (existingUser && existingUser.id !== user.id) {
  //     return { error: "Email already in use!" };
  //   }

  //   const verificationToken = await generateVerificationToken(values.email);

  //   return { success: "Verification email sent!" };
  // }

  // if (values.password && values.newPassword && dbUser.password) {
  //   const passwordsMatch = await bcrypt.compare(
  //     values.password,
  //     dbUser.password
  //   );

  //   if (!passwordsMatch) {
  //     return { error: "Incorrect password!" };
  //   }

  //   const hashedPassword = await bcrypt.hash(values.newPassword, 10);

  //   values.password = hashedPassword;
  //   values.newPassword = undefined;
  // }

  return { error: "Not Implemented!" };
};
