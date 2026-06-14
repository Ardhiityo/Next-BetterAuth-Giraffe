"use client"

import { deleteUserAction } from "@/app/actions/delete-user";
import { Button } from "./ui/button";
import { TrashIcon } from "lucide-react";
import { Role } from "@/generated/prisma/enums";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const DeleteUser = ({ role, id }: { role: string, id: string }) => {

    const router = useRouter();

    async function handleDelete(id: string) {
        const { error } = await deleteUserAction(id);
        if (error) {
            return toast.error(error)
        }
        toast.success("User deleted successfully")
        router.refresh();
    }

    return (
        <>
            {role === Role.ADMIN ? (
                <Button variant="destructive" disabled className="disabled:cursor-not-allowed">
                    <TrashIcon />
                </Button>
            ) : (
                <Button onClick={() => handleDelete(id)}>
                    <TrashIcon />
                </Button>
            )}
        </>
    )
}

export default DeleteUser