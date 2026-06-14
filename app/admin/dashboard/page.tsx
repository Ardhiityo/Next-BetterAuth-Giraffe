import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import SignOut from "@/components/sign-out";
import DeleteUser from "@/components/delete-user";
import { Role } from "@/generated/prisma/enums";
import SelectRole from "@/components/select-role";

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect('/auth/sign-in');
    }

    if (session.user.role !== Role.ADMIN) {
        return redirect('/profile');
    }

    const { users } = await auth.api.listUsers({
        query: {
            sortBy: 'role',
            limit: 10,
            offset: 0
        },
        // This endpoint requires session cookies.
        headers: await headers()
    });

    return (
        <section className="flex flex-col gap-5 w-1/2">
            <SignOut />
            <h1 className="text-3xl">Access Granted</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Id</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map(user => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.id.substring(0, 5)}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <SelectRole userId={user.id} role={user.role as Role} />
                            </TableCell>
                            <TableCell className="text-right">
                                <DeleteUser role={user.role as Role} id={user.id} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </section>
    );
}
