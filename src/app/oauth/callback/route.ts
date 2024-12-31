import { createClient } from "@/auth/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
    const params = new URLSearchParams(req.url.split('?')[1]);

    // use the returned oauth state to save the session
    const authClient = await createClient();
    const { session } = await authClient.callback(params);

    // save current user's DID too (is the key for the session cookie)
    const cookieStore = await cookies();
    cookieStore.set('did', session.did);

    return redirect('/');
}