import Sidebar from "@/components/Layout/dashboard/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex bg-[#f4f4f4] min-h-[calc(100vh-70px)] relative">
        <Sidebar />
        <div className="flex-1 m-5 w-full h-[85vh] overflow-y-auto hide-scroll">
          <div className="container">{children}</div>
        </div>
      </div>
    </>
  );
}
