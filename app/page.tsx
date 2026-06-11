import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Button variant={"link"}>
        <Link href={"/sign-in"}>Sign In</Link>
      </Button>
      <Button variant={"link"}>
        <Link href={"/sign-in-server"}>Sign In Server</Link>
      </Button>
      <Button variant={"link"}>
        <Link href={"/sign-up"}>Sign Up</Link>
      </Button>
    </div>
  );
}
