import { loginUser } from "@/services/auth";
import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials as any;
        const res: any = await loginUser({ email, password });
        const userData: any = await res.json();
        console.log(userData);
        if (!res.ok) throw new Error(userData.message);
        if (res.ok && userData) {
          cookies().set("token", userData.token);
          const user = {
            id: userData.user._id,
            email: userData.user.email,
            role: userData.user.role,
            userToken: userData.token,
          };
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user = token as any;
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// export default NextAuth(authOptions);
