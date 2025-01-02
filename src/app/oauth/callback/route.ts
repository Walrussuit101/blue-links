import { getHandleFromDID } from "@/atproto";
import { createAuthClient } from "@/auth/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

// Get the oauth state (session) back from user's PDS after they authenticate
export const GET = async (req: NextRequest) => {
    const params = req.nextUrl.searchParams;

    // use the returned oauth state to save the session
    const authClient = await createAuthClient();
    const { session } = await authClient.callback(params);

    // save current user's DID too (is the key for the session cookie)
    const cookieStore = await cookies();
    cookieStore.set('did', session.did);

    // redirect user to their page
    const handle = await getHandleFromDID(session.did);

    if (!handle) {
        throw new Error(`Could not resolve handle for DID "${session.did}" `)
    }

    return redirect(`/u/${handle}`);
}