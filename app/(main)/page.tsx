"use client"
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const { user } = useUser();
  return (
    <div>
      <div className="flex p-3">
        <UserButton afterSignOutUrl="/" />
      </div>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        {!user ?
          <div>
            <Link href="/sign-in"> <Button>Sign In</Button></Link>
            <Link href="/sign-up"> <Button variant="outline">Sign Up</Button> </Link>
          </div>
          :
          <Button>Hello</Button>
        }
      </div>
    </div>
  );
}
