"use client";

import { Button } from "./ui/button";
import { signOut } from "@/lib/auth-client";
import { ErrorContext } from "better-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function SignOut() {
  const { push } = useRouter();

  async function handleSignOut() {
    await signOut({
      fetchOptions: {
        onRequest: () => {},
        onResponse: () => {},
        onSuccess: () => {
          toast.success("Sign out successfully");
          push("/auth/sign-in");
        },
        onError: (ctx: ErrorContext) => {
          toast.error(ctx.error.message || "Something wrong");
        },
      },
    });
  }
  return <Button onClick={handleSignOut}>Logout</Button>;
}

export default SignOut;
