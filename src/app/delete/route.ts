import { getBlueLinksAgent, getHandleFromDID, restoreSession } from "@/atproto";
import { createAuthClient } from "@/auth/client";
import { cookies } from "next/headers"
import { redirect } from "next/navigation";

// Collection names the app has used previously
const possibleCollections = ['info.timjefferson.dev.blue-links.links'];

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

        const agent = getBlueLinksAgent(session);
        const handle = await getHandleFromDID(session.did);

        // delete fyi.bluelinks.* namespace collections / records
        await agent.fyi.bluelinks.links.delete({
            repo: session.did,
            rkey: 'self'
        });

        // delete extra records not in fyi.bluelinks.* namespace that the app possibly has made
        for (let i = 0; i < possibleCollections.length; i++) {
            await agent.com.atproto.repo.deleteRecord({
                repo: session.did,
                collection: possibleCollections[i],
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