import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Button variant={"link"}>
        <Link href={"/auth/sign-in"}>Sign In</Link>
      </Button>
      <Button variant={"link"}>
        <Link href={"/auth/sign-in-server"}>Sign In Server</Link>
      </Button>
      <Button variant={"link"}>
        <Link href={"/auth/sign-up"}>Sign Up</Link>
      </Button>
      <Button variant={"link"}>
        <Link href={"/auth/sign-up-server"}>Sign Up Server</Link>
      </Button>
    </div>
  );
}
