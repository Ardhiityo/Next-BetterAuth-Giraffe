// Penempatan /actions bebas dimana saja asalkan mendefiniskan use server

"use server";

import { auth } from "@/lib/auth";

export async function signInEmailAction(form: FormData) {
  try {
    await auth.api.signInEmail({
      body: {
        email: form.get("email") as string,
        password: form.get("password") as string,
      },
    });
    return { error: null };
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: "Internal server error" };
  }
}
