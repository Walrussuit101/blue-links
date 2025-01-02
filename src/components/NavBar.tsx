import { getHandleFromDID, restoreSession } from "@/atproto";
import { createClient } from "@/auth/client";
import { cookies } from "next/headers"
import { ReactNode } from "react";

const NavBar = async () => {
    const cookieStore = await cookies();
    const client = await createClient();

    const did = cookieStore.get('did');
    const session = await restoreSession(client, did?.value);

    if (session) {
        const handle = await getHandleFromDID(session!.did);

        return NavContent(
            <a href="/logout">
                <button className="bg-white text-black h-8 w-20">Log Out</button>
            </a>,
            <p>{handle}</p>,
        );
    } else {
        return NavContent(
            <a href="/login">
                <button className="bg-white text-black h-8 w-20">Log In</button>
            </a>
        )
    }
}

const NavContent = (button: ReactNode, handle?: ReactNode) => {
    return (
        <nav className="flex w-screen h-16 bg-slate-900 justify-between items-center">
            {handle ?? <div />}
            <div />
            {button}
        </nav>
    )
}

export default NavBar;