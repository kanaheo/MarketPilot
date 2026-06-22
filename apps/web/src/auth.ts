import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { syncAuthenticatedUser } from "@/lib/server/auth-user-sync";

const googleClientId = process.env.AUTH_GOOGLE_ID;
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET;
const googleProvider =
  googleClientId && googleClientSecret
    ? Google({
        clientId: googleClientId,
        clientSecret: googleClientSecret,
      })
    : null;

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async jwt({ account, token, user }) {
      if (account) {
        const syncedUser = await syncAuthenticatedUser({
          authProvider: account.provider,
          authSubject: account.providerAccountId,
          displayName: user.name ?? null,
          email: user.email ?? null,
          imageUrl: user.image ?? null,
        });
        token.marketPilotUserId = syncedUser.id;
      }

      return token;
    },
    session({ session, token }) {
      if (typeof token.marketPilotUserId === "string") {
        session.user.id = token.marketPilotUserId;
      }

      return session;
    },
  },
  providers: googleProvider ? [googleProvider] : [],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  trustHost: true,
});
