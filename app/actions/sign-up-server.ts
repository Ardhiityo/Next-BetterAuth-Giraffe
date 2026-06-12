// Penempatan /actions bebas dimana saja asalkan mendefiniskan use server

"use server";

import { auth, ErrorCode } from "@/lib/auth";
import { APIError } from "better-auth/api";

export async function signUpEmailAction(form: FormData) {
  try {
    await auth.api.signUpEmail({
      body: {
        name: form.get("name") as string,
        email: form.get("email") as string,
        password: form.get("password") as string,
      },
    });
    return { error: null };
  } catch (error) {
    if (error instanceof APIError) {
      const errCode = error.body ? error.body.code : "UNKNOWN";
      switch (errCode) {
        case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
          return { error: "Oops! Something went wrong. Please try again." };
        default:
          return { error: error.message };
      }
    }
    return { error: "Internal server error" };
  }
}
