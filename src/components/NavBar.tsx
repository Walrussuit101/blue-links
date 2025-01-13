import Link from "next/link";
import { ReactNode } from "react";

interface Props {
    handle?: string
}
const NavBar = ({ handle }: Props) => {
    if (handle) {
        return NavContent(
            // Is a "route", can't use <Link/>
            <a href="/logout">
                <button className="bg-white text-black h-8 w-20">Log Out</button>
            </a>,
            <div className="flex gap-4 justify-center items-center">
                <Link href={`/u/${handle}`} className="underline">
                    {handle}
                </Link>
                <Link href={`/edit/${handle}`}>
                    <button className="bg-white text-black h-8 w-20">Edit</button>
                </Link>
            </div>
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