import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import SignOut from "@/components/sign-out";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="px-8 py-16 container mx-auto space-y-4">
      <SignOut />
      <pre className="text-sm overflow-clip">
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
};

export default Page;
