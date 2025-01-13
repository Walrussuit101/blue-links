import { getHandleFromDID, restoreSession } from "@/atproto";
import { createAuthClient } from "@/auth/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
    const cookieStore = await cookies();
    const authClient = await createAuthClient();

    const did = cookieStore.get('did');
    const session = await restoreSession(authClient, did?.value);

    if (!session) {
        return new NextResponse(null, { status: 401 });
    } else {
        const handle = await getHandleFromDID(session.did);
        return NextResponse.json({ did: session.did, handle: handle }, { status: 200 });
    }
}