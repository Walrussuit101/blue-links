import { getHandleFromDID, restoreSession } from "@/atproto";
import { createAuthClient } from "@/auth/client";
import { LinkCollection } from "@/types";
import { Agent } from "@atproto/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const linksAction = async (prevState: any, formData: FormData) => {
    'use server';

    const cookieStore = await cookies();
    const authClient = await createAuthClient();

    const did = cookieStore.get('did');
    const session = await restoreSession(authClient, did?.value);
    const dataToSave = formData.get('data');

    if (!session) {
        return redirect('/login');
    }

    if (!dataToSave) {
        throw new Error('Invalid session / data');
    }

    const agent = new Agent(session);
    await agent.com.atproto.repo.putRecord({
        repo: session.did,
        collection: LinkCollection,
        rkey: 'self',
        record: {
            $type: LinkCollection,
            links: JSON.parse(dataToSave.toString())
        }
    });

    const handle = await getHandleFromDID(session.did);

    return redirect(`/u/${handle}`);
}