import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { v4 as uuidv4 } from "uuid";
import { nextCookies } from "better-auth/next-js";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { normalizeName, validDomains } from "./utils";
import { Role } from "@/generated/prisma/enums";
import { admin as adminPlugin } from "better-auth/plugins";
import { ac, ADMIN, USER } from "./permissions"

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
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  account: {
    accountLinking: {
      /**
        enable : false
        Jika email sudah terverifikasi dan login dengan google maka akan tetap ditolak, karena akun sudah teregistrasi dengan email & password.

        enable : true
        Jika email sudah terverifikasi dan login dengan google maka akan diterima, dan akan menghasilkan account 2 (1. email & password, 2. google)
       */
      //default true
      enabled: false,
    }
  },
  advanced: {
    database: {
      // default true, jika ingin custom contohnya pakau uuid
      generateId: () => uuidv4(),
    },
  },
  plugins: [
    adminPlugin({
      /**
       Access Control instance yang dibuat via createAccessControl(statement). Ini mendefinisikan "daftar permission yang mungkin ada" — semua resource (user, session) dan action-nya (list, create, dst). ac menjadi "induk" dari semua role yang dibuat, karena setiap role hanya boleh assign permission yang sudah didefinisikan di statement.
       */
      ac,
      /**
      Map antara nama role (string key) dengan role object (hasil ac.newRole(...)). Key inilah yang dicocokkan dengan session.user.role di database saat pengecekan permission. Jadi kalau DB menyimpan "ADMIN", plugin akan lookup roles["ADMIN"] dan memanggil .authorize() untuk cek apakah role itu punya permission yang diminta.
       */
      roles: {
        ADMIN, //key ADMIN, value ADMIN
        USER //key USER, value USER
      },
      /**
      Role yang otomatis di-assign ke user baru yang dibuat melalui admin plugin (via auth.api.createUser). Ini beda dengan databaseHooks.user.create.before — hook itu untuk user yang daftar via form sign-up biasa. Nilai Role.USER = string "USER".
      
      1. auth.api.createUser — kalau tidak ada role yang di-pass saat membuat user lewat endpoint admin, maka defaultRole yang dipakai.
      2. hasPermission — kalau session.user.role nilainya null atau kosong, plugin fallback ke defaultRole sebagai role-nya saat mengecek permission.
      */
      defaultRole: Role.USER,
      /**
      Daftar role yang dianggap sebagai "super admin" oleh plugin. Efeknya: user dengan role ini tidak bisa di-ban, tidak bisa dihapus, tidak bisa di-impersonate oleh admin lain (kecuali allowImpersonatingAdmins: true). Ini bukan tentang siapa yang boleh akses endpoint admin — itu diatur lewat permission di roles — tapi tentang siapa yang dilindungi dari aksi admin.
       */
      adminRoles: [Role.ADMIN]
    }),
    nextCookies(), // nextCookies digunakan untuk jika auth dengan serverside via actions
  ],
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
  user: {
    additionalFields: {
      role: {
        type: ["ADMIN", "USER"] as const,
        //untuk fillable, misal input false, maka field tersebut tidak bisa diisi di form
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        // Modify user data before creation
        before: async (user) => {
          const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(';') ?? [];
          if (ADMIN_EMAILS.includes(user.email)) {
            return { data: { ...user, role: Role.ADMIN } };
          }
          return { data: { ...user, role: Role.USER } };
        },
      }
    }
  }
});

export type ErrorCode = keyof typeof auth.$ERROR_CODES | "UNKNOWN";
