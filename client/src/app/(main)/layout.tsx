import "../globals.css";
import { Montserrat } from "next/font/google";
import CustomThemeProvider from "@/components/providers/CustomThemeProvider";
import Footer from "@/components/Layout/Footer";
import Navbar from "@/components/Layout/Navbar";
import { cookies } from "next/headers";
import { Suspense } from "react";
import Loading from "./loading";
import Provider from "@/components/providers/Provider";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get("token")?.value ?? null;
  const sellerToken = cookies().get("seller_token")?.value ?? null;

  console.log("USER TOKEN", token);
  const data = await getServerSession(authOptions);
  console.log("Session TOKEN", data);
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Provider>
          <CustomThemeProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar token={token} sellerToken={sellerToken} />
              <Suspense fallback={<Loading />}>{children}</Suspense>
              <Footer />
            </div>
          </CustomThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
