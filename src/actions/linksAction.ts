import { getBlueLinksAgent, getHandleFromDID, restoreSession } from "@/atproto";
import { createAuthClient } from "@/auth/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as Links from '@/lexicon/types/fyi/bluelinks/links';
import { revalidatePath } from "next/cache";

export const linksAction = async (prevState: any, formData: FormData) => {
    'use server';

    // get user's session
    const cookieStore = await cookies();
    const authClient = await createAuthClient();

    const did = cookieStore.get('did');
    const session = await restoreSession(authClient, did?.value);

    if (!session) {
        return redirect('/login');
    }

    // validate data passed to action
    const dataToSave = formData.get('data');

    const record = {
        $type: 'fyi.bluelinks.links',
        links: JSON.parse(dataToSave?.toString() ?? '')
    }

    if (!Links.validateRecord(record).success) {
        throw new Error('Invalid data provided');
    }

    // make agent for user and save record
    const agent = getBlueLinksAgent(session);
    await agent.com.atproto.repo.putRecord({
        // code gen from @atproto/lex-cli doesn't include a .put() or .update() method on the fyi.bluelinks.links namespace,
        // have to use com.atproto.repo.putRecord with the collection name and validate the record above
        repo: session.did,
        collection: 'fyi.bluelinks.links',
        rkey: 'self',
        record,
        validate: false
    });

    // redirect to the user's page to show changes
    const handle = await getHandleFromDID(session.did);
    const path = `/u/${handle}`;

    revalidatePath(path)
    return redirect(path);
}