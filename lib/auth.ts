import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { v4 as uuidv4 } from "uuid";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 6,
  },
  advanced: {
    database: {
      // default true, jika ingin custom contohnya pakau uuid
      generateId: () => uuidv4(),
    },
  },
  // nextCookies digunakan untuk jika auth dengan serverside via actions
  plugins: [nextCookies()],
});
