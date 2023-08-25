// import { withAuth } from "next-auth/middleware";
// import { NextResponse } from "next/server";

// export default withAuth(
//   function middleware(req) {
//     if (
//       req.nextUrl.pathname.startsWith("/dashboard") &&
//       req.nextauth.token?.role !== "Seller"
//     ) {
//       return NextResponse.rewrite(new URL("shop/login", req.url));
//     }
//     if (
//       req.nextUrl.pathname.startsWith("/") &&
//       req.nextauth.token?.role == "Seller"
//     ) {
//       return NextResponse.rewrite(new URL("login", req.url));
//     }
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token,
//     },
//   }
// );

export { default } from "next-auth/middleware";

export const config = { matcher: ["/profile"] };
