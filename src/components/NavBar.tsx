import { getHandleFromDID, restoreSession } from "@/atproto";
import { createAuthClient } from "@/auth/client";
import { cookies } from "next/headers"
import Link from "next/link";
import { ReactNode } from "react";

const NavBar = async () => {
    const cookieStore = await cookies();
    const authClient = await createAuthClient();

    const did = cookieStore.get('did');
    const session = await restoreSession(authClient, did?.value);

    if (session) {
        const handle = await getHandleFromDID(session.did);

        return NavContent(
            // Is a "route", can't use <Link/>
            <a href="/logout">
                <button className="bg-white text-black h-8 w-20">Log Out</button>
            </a>,
            <Link href={`/u/${handle}`} className="underline">
                {handle}
            </Link>,
        );
    } else {
        return NavContent(
            <Link href="/login">
                <button className="bg-white text-black h-8 w-20">Log In</button>
            </Link>
        )
    }
}

const NavContent = (button: ReactNode, handle?: ReactNode) => {
    return (
        <nav className="flex w-full h-16 bg-zinc-900 justify-between items-center px-4">
            {handle ?? <div />}
            <div />
            {button}
        </nav>
    )
}

export default NavBar;