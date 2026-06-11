"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp } from "@/lib/auth-client";
import { ErrorContext } from "better-auth/react";
import { useRouter } from "next/navigation";
import { SubmitEvent, useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { push } = useRouter();

  async function handleSignUp(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    if (!name) return toast.error("The name field is required");
    if (!email) return toast.error("The email field is required");
    if (!password) return toast.error("The password field is required");

    await signUp.email(
      { name, email, password },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onResponse: () => {
          setIsLoading(false);
        },
        onSuccess: () => {
          toast.success("Sign up successfully");
          push("/sign-in");
        },
        onError: (ctx: ErrorContext) => {
          toast.error(ctx.error.message || "Something wrong");
        },
      },
    );
  }

  return (
    <form onSubmit={handleSignUp}>
      <h1 className="text-2xl text-center mb-3">Sign Up</h1>
      <div className="mt-2">
        <label htmlFor="name">Name</label>
        <Input name="name" id="name" />
      </div>
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
        <Button variant={"link"} type="button" onClick={() => push("/sign-in")}>
          Sign In
        </Button>
      </div>
    </form>
  );
};

export default Page;
