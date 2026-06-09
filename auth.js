import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { userDb, orgMemberDb } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await userDb.findByEmail(credentials.email);

        if (!user) {
          throw new Error("Invalid email or password");
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password,
        );

        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        const userOrgs = await orgMemberDb.getOrgsForUser(user.id);
        const currentOrgId = userOrgs.length > 0 ? userOrgs[0].id : null;
        const currentOrgRole = userOrgs.length > 0 ? userOrgs[0].user_role : null;

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          currentOrgId: currentOrgId?.toString(),
          currentOrgRole,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.currentOrgId = user.currentOrgId;
        token.currentOrgRole = user.currentOrgRole;
      }

      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }

      if (trigger === "update" && session?.currentOrgId) {
        token.currentOrgId = session.currentOrgId;
        token.currentOrgRole = session.currentOrgRole;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.currentOrgId = token.currentOrgId;
        session.user.currentOrgRole = token.currentOrgRole;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
});