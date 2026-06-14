"use client";

import { Button } from "./ui/button";
import { signOut, authClient } from "@/lib/auth-client";
import { ErrorContext } from "better-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function SignOut() {
  const { push } = useRouter();
  const { data, isPending } = (authClient as any).useSession();

  if (!isPending) {
    //role bisa dikenali karena hasil inferAdditionalFields<typeof auth>()
    console.log(data?.user.role);
  }

  async function handleSignOut() {
    await signOut({
      fetchOptions: {
        onRequest: () => { },
        onResponse: () => { },
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
  return (
    <>
      <div className="flex items-center gap-3">
        {data?.user.role && (
          <p className="flex items-center gap-2">
            <span
              data-role={data.user.role}
              className="size-4 rounded-full animate-pulse data-[role=USER]:bg-blue-600 data-[role=ADMIN]:bg-red-600"
            />
            Welcome back, {data.user.name}! 👋
          </p>
        )}
        <Button onClick={handleSignOut}>Logout</Button>
      </div>
    </>
  )


}

export default SignOut;
