import { createClient } from "@/auth/client";
import { cookies } from "next/headers"
import { redirect } from "next/navigation";

export const GET = async () => {
    const cookieStore = await cookies();

    const didCookie = cookieStore.get('did');

    if (didCookie) {
        const did = didCookie.value;

        const authClient = await createClient();
        await authClient.revoke(did);

        cookieStore.delete('did');
    }

    redirect('/');
}