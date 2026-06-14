"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";

const SignInOAuth = ({ provider }: { provider: string }) => {
    const [isLoading, setIsLoading] = useState(false);

    async function handleSignIn() {
        await authClient.signIn.social({
            provider,
            callbackURL: '/profile',
            errorCallbackURL: '/auth/sign-in/error',
            fetchOptions: {
                onRequest: () => { setIsLoading(true) },
                onResponse: () => { setIsLoading(false) },
                onError: (ctx) => {
                    toast.error(ctx.error.message)
                }
            }
        });
    }

    return (
        <Button onClick={handleSignIn} disabled={isLoading}>
            {isLoading ? 'Loading...' : `Sign In With ${provider === 'google' ? 'Google' : 'Github'}`}
        </Button>
    )
}

export default SignInOAuth;
