import Link from "next/link";
import { ModeToggle } from "../toggleModeButton";
import CustomUserButton from "@/components/customUserButton";
import {
    SignInButton,
    SignedIn,
    SignedOut,
} from '@clerk/nextjs'

export default function Header() {
    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', padding: 20 }}>
            <Link href="/"><h1 className="text-xl font-extrabold">Commet</h1></Link>
            <div className="flex gap-10">
                <ModeToggle />
                <SignedIn>
                    <CustomUserButton />
                </SignedIn>
                <SignedOut>
                    <SignInButton />
                </SignedOut>
            </div>
        </header>
    )
}