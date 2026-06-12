"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, signUp } from "@/lib/auth-client";
import { ErrorContext } from "better-auth/react";
import { useRouter } from "next/navigation";
import { SubmitEvent, useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { push } = useRouter();

  async function handleSignIn(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const email = form.get("email") as string;
    const password = form.get("password") as string;

    if (!email) return toast.error("The email field is required");
    if (!password) return toast.error("The password field is required");

    await signIn.email(
      { email, password },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onResponse: () => {
          setIsLoading(false);
        },

        onSuccess: () => {
          toast.success("Sign in successfully");
          push("/profile");
        },
        onError: (ctx: ErrorContext) => {
          toast.error(ctx.error.message || "Something wrong");
        },
      },
    );
  }

  return (
    <form onSubmit={handleSignIn}>
      <h1 className="text-2xl text-center mb-3">Sign In</h1>
      <div className="mt-2">
        <label htmlFor="email">Email</label>
        <Input name="email" id="email" />
      </div>
      <div className="mt-2">
        <label htmlFor="password">Password</label>
        <Input name="password" id="password" />
      </div>
      <div className="mt-4">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Loading..." : "Submit"}
        </Button>
      </div>
      <div className="mt-4">
        <Button
          variant={"link"}
          type="button"
          onClick={() => push("/auth/sign-up")}
        >
          Sign Up
        </Button>
      </div>
    </form>
  );
};

export default Page;
