"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function deleteUserAction(id: string) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || id === session.user.id) {
        return { error: 'Forbidden' };
    }

    const response = await auth.api.removeUser({
        body: {
            userId: id, // required
        },
        // This endpoint requires session cookies.
        headers: await headers(),
    });

    if (!response.success) {
        return { error: 'Internal Server Error' }
    }

    return { error: null }
}