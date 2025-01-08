import Link from "next/link";

const NotFound = () => {
    return (
        <div className="flex flex-col h-screen w-full justify-center items-center gap-4">
            <p className="text-xl">Page could not found :(</p>
            <Link href="/">
                <button className="bg-white text-black h-8 w-24">Go Home</button>
            </Link>
        </div>
    )
}

export default NotFound;