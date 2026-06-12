import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { v4 as uuidv4 } from "uuid";
import { nextCookies } from "better-auth/next-js";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { normalizeName, validDomains } from "./utils";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    /**
      Pada dokumentasi Better Auth terbaru terdapat catatan seperti ini:
      To prevent email enumeration, when autoSignIn is disabled or requireEmailVerification is enabled
      the sign-up endpoint returns a successful response even if the email already exists.
      ---
      jika autoSignIn true
      → proteksi email enumeration dinonaktifkan
      → duplicate email = error

      jika autoSignIn false
      → proteksi email enumeration diaktifkan
      → duplicate email = success
      ---
      jika requireEmailVerification true
      → proteksi email enumeration diaktifkan
      → duplicate email = success

      jika requireEmailVerification false
      → proteksi email enumeration dinonaktifkan
      → duplicate email = error
     */
    autoSignIn: true, //default
    requireEmailVerification: false, //default
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
  session: {
    // default 30 days, satuan second
    expiresIn: 60 * 60 * 24 * 30,
  },
  // Hanya menerima 3 request per 5 detik
  rateLimit: {
    enabled: true,
    window: 5,
    max: 3,
    storage: "memory",
    modelName: "rateLimit",
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const email = ctx.body?.email;
        if (!email) return;
        const domain = ctx.body?.email.split("@")[1];
        if (!validDomains().includes(domain)) {
          throw new APIError("BAD_REQUEST", {
            message: "Please provide a valid email.",
          });
        }

        const name = String(normalizeName(ctx.body.name));

        return {
          context: {
            ...ctx,
            body: {
              ...ctx.body,
              name,
            },
          },
        };
      }
    }),
  },
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";
