import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./_provider/theme-provider";
import HoverPlayer from "@/components/hover-player";
import AdminPanelLayout from "@/components/layout/layout-wrapper";
import { ContentLayout } from "@/components/layout/content-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next Auth | NextJS",
  description: "Authentication using next-auth-v5",
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
            <HoverPlayer />
            <Toaster />
            <AdminPanelLayout>
              <ContentLayout title="Your Blogs">
                {children}
              </ContentLayout>
            </AdminPanelLayout>

          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
