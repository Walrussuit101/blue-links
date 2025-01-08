import { getHandleFromDID, restoreSession } from "@/atproto";
import { createAuthClient } from "@/auth/client";
import { Agent } from "@atproto/api";
import { cookies } from "next/headers"
import { redirect } from "next/navigation";

const collections = ['fyi.bluelinks.links', 'info.timjefferson.dev.blue-links.links'];

// For the current user, delete any records that this app has potentially created
export const GET = async () => {
    const cookieStore = await cookies();

    const didCookie = cookieStore.get('did');

    if (didCookie) {
        const did = didCookie.value;

        const authClient = await createAuthClient();
        const session = await restoreSession(authClient, did);

        if (!session) {
            redirect('/login');
        }

        const agent = new Agent(session);
        const handle = await getHandleFromDID(session.did);

        // delete records
        for (let i = 0; i < collections.length; i++) {
            await agent.com.atproto.repo.deleteRecord({
                repo: session.did,
                collection: collections[i],
                rkey: 'self'
            })
        }

        // remove cookies / revoke session (log user out)
        await authClient.revoke(session.did);
        cookieStore.delete('did');

        // redirect to their page to show blue links data has been removed
        redirect(`/u/${handle}`);
    } else {
        redirect('/login');
    }
}