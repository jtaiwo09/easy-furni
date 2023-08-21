import "../globals.css";
import { Montserrat } from "next/font/google";
import CustomThemeProvider from "@/components/providers/CustomThemeProvider";
import Footer from "@/components/Layout/Footer";
import Navbar from "@/components/Layout/Navbar";
import { cookies } from "next/headers";
import { Suspense } from "react";
import Loading from "./loading";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get("token")?.value ?? null;
  const sellerToken = cookies().get("seller_token")?.value ?? null;
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <CustomThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar token={token} sellerToken={sellerToken} />
            <Suspense fallback={<Loading />}>{children}</Suspense>
            <Footer />
          </div>
        </CustomThemeProvider>
      </body>
    </html>
  );
}
