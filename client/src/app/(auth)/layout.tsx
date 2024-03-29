import "../globals.css";
import { Montserrat } from "next/font/google";
import CustomThemeProvider from "@/components/providers/CustomThemeProvider";
import AuthNav from "@/components/Layout/AuthNav";
import { cookies } from "next/headers";
import { Suspense } from "react";
import Loading from "./loading";
import { redirect } from "next/navigation";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get("token")?.value ?? null;
  // if (token) redirect("/");
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <CustomThemeProvider>
          <Suspense fallback={<Loading />}>
            <AuthNav />
            <div className="flex flex-col min-h-[calc(100vh-70px)]">
              {children}
            </div>
          </Suspense>
        </CustomThemeProvider>
      </body>
    </html>
  );
}
