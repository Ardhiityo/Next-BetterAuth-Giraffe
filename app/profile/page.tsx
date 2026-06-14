import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import SignOut from "@/components/sign-out";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Role } from "@/generated/prisma/enums";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="px-8 py-16 container mx-auto space-y-4">
      <SignOut />

      {session.user.role === Role.ADMIN && (
        <div>
          <Button>
            <Link href={'/admin/dashboard'}>Admin Dashboard</Link>
          </Button>
        </div>
      )}

      <pre className="text-sm overflow-clip">
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
};

export default Page;
