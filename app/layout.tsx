import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./_provider/theme-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import HoverPlayer from "@/components/speech/hover-player";
import NextTopLoader from "@/components/loader/top-loader";
import { Navbar } from "@/components/nav/navbar";
import { Footer } from "@/components/layout/footer";
import AppNavigate from "@/components/navigation/app-navigate";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quickstart",
  description: "Welcome to Tanakit - Project",
  icons: {
    icon: "/icon.png",
  },
};


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(inter.className, "h-fit")}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <NextTopLoader />
            <SocketProvider>
              <Toaster />
              <Navbar />
              {children}
              <Footer />
            </SocketProvider>
            <AppNavigate />
            <HoverPlayer />
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
