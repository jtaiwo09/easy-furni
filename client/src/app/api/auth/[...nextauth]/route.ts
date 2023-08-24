import { loginUser } from "@/services/auth";
import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials, req) {
        console.log(credentials);
        const res: any = await loginUser(credentials);
        const user = await res.json();
        if (res.ok && user) {
          cookies().set("token", user.token, {
            secure: true,
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
            // domain: ".jtk-store.vercel.app",
          });
          return user.user;
        }
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user = token as any;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl + "/";
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// export default NextAuth(authOptions);
