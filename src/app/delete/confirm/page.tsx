import AuthGuard from "@/components/AuthGuard";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: 'Delete | Blue Links'
}

const ConfirmDelete = async () => {
    return (
        <AuthGuard navbar>
            <div className="flex w-full h-screen flex-col justify-start items-center pt-28 md:pt-52 px-6 text-center">
                <p>Blue Links does not save or copy any of your data to external services.</p>
                <p className="mt-2">All deletion requests will be sent to your PDS (personal data server), whether that's hosted by Bluesky or independently.</p>
                <div className="flex flex-wrap justify-center items-center gap-5 mt-4">
                    <a href="/delete">
                        <button className="bg-red-500 text-black h-8 w-32">Delete Data</button>
                    </a>
                    <Link href='/'>
                        <button className="bg-white text-black h-8 w-28">Never Mind</button>
                    </Link>
                </div>
            </div>
        </AuthGuard>
    )
}

export default ConfirmDelete;