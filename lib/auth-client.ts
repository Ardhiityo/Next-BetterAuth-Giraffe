import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins";
import { adminClient } from "better-auth/client/plugins"
import { ac, ADMIN, USER } from "./permissions"
import type { auth } from "@/lib/auth";

export const authClient = createAuthClient({
  //inferAdditionalFields hanya relevan di client component yang pakai useSession() dari auth-client.ts.
  // karena di sana Better Auth client tidak punya akses langsung ke tipe server. Plugin itulah yang menjembatani supaya useSession().data.user.role juga dikenali TypeScript.
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient({
      ac,
      roles: {
        ADMIN, USER
      }
    })],
});

export const { signIn, signUp, signOut, admin } = authClient;
