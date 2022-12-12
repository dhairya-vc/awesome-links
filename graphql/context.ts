import { PrismaClient } from "@prisma/client";
// import { Claims, getSession } from "@auth0/nextjs-auth0";
import { unstable_getServerSession } from "next-auth/next";

import prisma from "../lib/prisma";
import { authOptions } from "../pages/api/auth/[...nextauth]";

export type Context = {
  // user?: Claims;
  user?: any;
  // accessToken?: string;
  prisma: PrismaClient;
};

export async function createContext({ req, res }): Promise<Context> {
  // const session = await getSession(req, res);
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) return { prisma };

  const { user } = session;

  return {
    user,
    prisma,
  };
}
