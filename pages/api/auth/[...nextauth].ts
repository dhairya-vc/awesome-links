import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import prisma from "../../../lib/prisma";

async function comparePassword(hash, password) {
  return await bcrypt.compare(password, hash);
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Password",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials.email || !credentials.password) {
          throw new Error("Missing required credentials");
        }

        let user: any;
        try {
          user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });
        } catch (error) {
          throw new Error(error.message);
        }

        if (!user) {
          throw new Error("User not found!");
        }

        const isValidPassword = await comparePassword(
          user.password,
          credentials.password
        );

        if (!isValidPassword) {
          throw new Error("Incorrect password!");
        }

        return {
          id: user.id,
          createdAt: user.createdAt,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ token, user }) => {
      user && (token.user = user);
      return token;
    },
    session: async ({ session, user, token }) => {
      session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};

export default NextAuth(authOptions);
