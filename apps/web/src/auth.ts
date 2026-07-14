import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { syncAuthenticatedUser } from "@/lib/server/auth-user-sync";
import {
  getOptionalServerEnv,
  requireProductionServerEnv,
} from "@/lib/server/env";
import { verifyPasswordCredentials } from "@/lib/server/password-auth";

requireProductionServerEnv([
  "AUTH_SECRET",
  "AUTH_GOOGLE_ID",
  "AUTH_GOOGLE_SECRET",
  "MARKETPILOT_API_URL",
  "MARKETPILOT_INTERNAL_API_TOKEN",
  "MARKETPILOT_USER_API_SIGNING_SECRET",
]);

const googleClientId = getOptionalServerEnv("AUTH_GOOGLE_ID");
const googleClientSecret = getOptionalServerEnv("AUTH_GOOGLE_SECRET");
const googleProvider =
  googleClientId && googleClientSecret
    ? Google({
        clientId: googleClientId,
        clientSecret: googleClientSecret,
      })
    : null;

const passwordProvider = Credentials({
  credentials: {
    email: {},
    password: {},
  },
  async authorize(credentials) {
    const email = credentials?.email;
    const password = credentials?.password;

    if (typeof email !== "string" || typeof password !== "string") {
      return null;
    }

    const user = await verifyPasswordCredentials({ email, password });
    if (user === null) {
      return null;
    }

    return {
      email: user.email,
      id: user.id,
      image: user.image_url,
      name: user.display_name,
    };
  },
});

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async jwt({ account, token, user }) {
      if (account?.provider === "credentials") {
        token.marketPilotUserId = user.id;
      } else if (account) {
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
  providers: googleProvider
    ? [googleProvider, passwordProvider]
    : [passwordProvider],
  secret: getOptionalServerEnv("AUTH_SECRET") ?? undefined,
  session: {
    maxAge: 60 * 60 * 24 * 7,
    strategy: "jwt",
    updateAge: 60 * 60 * 24,
  },
  trustHost: true,
});
