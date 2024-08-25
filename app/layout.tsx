import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./_provider/theme-provider";
import AdminPanelLayout from "@/components/layout/layout-wrapper";
import { ContentLayout } from "@/components/layout/content-layout";
import { SocketProvider } from "@/components/providers/socket-provider";
import HoverPlayer from "@/components/speech/hover-player";
import NextTopLoader from "@/components/loader/top-loader";
import { Navbar } from "@/components/nav/navbar";
import { Footer } from "@/components/layout/footer";
import AppNavigate from "@/components/navigation/app-navigate";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quickstart",
  description: "Authentication",
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
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <NextTopLoader />
            <SocketProvider>
              <Toaster />
              <Navbar title="Test" />
              <AdminPanelLayout>
                <ContentLayout title="Your Blogs">
                  {children}
                </ContentLayout>
              </AdminPanelLayout>
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
