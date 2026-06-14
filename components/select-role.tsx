"use client";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Role } from "@/generated/prisma/enums";
import { admin } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SelectRole({ userId, role }: { userId: string, role: Role }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleChangeRole(newRole: Role | null) {
        if (!newRole) return;

        await admin.setRole({
            userId,
            role: newRole, // required
        }, {
            onRequest: () => { setIsLoading(true) },
            onResponse: () => { setIsLoading(false) },
            onSuccess: () => {
                router.refresh()
                toast.success('Role updated successfully')
            },
            onError: (ctx) => { toast.error(ctx.error.message) }
        });
    }

    return (
        <Select value={role} onValueChange={handleChangeRole} disabled={isLoading}>
            <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Role</SelectLabel>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                    <SelectItem value="USER">USER</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
} 