import { linksAction } from "@/actions/linksAction";
import { getBlueLinksAgent, restoreSession } from "@/atproto";
import { createAuthClient } from "@/auth/client";
import LinksForm from "@/forms/LinksForm";
import { Metadata } from "next";
import { cookies } from "next/headers"
import { redirect } from "next/navigation";
import * as Links from '@/lexicon/types/fyi/bluelinks/links';

export const metadata: Metadata = {
    title: 'Edit | Blue Links'
}

const EditPage = async () => {
    const cookieStore = await cookies();
    const authClient = await createAuthClient();

    const did = cookieStore.get('did');
    const session = await restoreSession(authClient, did?.value);

    if (!session) {
        return redirect('/login');
    } else {
        // get link data from user
        const agent = getBlueLinksAgent(session);

        let linksRecord: Links.Record;
        try {
            const data = await agent.fyi.bluelinks.links.get({
                repo: session.did,
                rkey: 'self'
            });

            linksRecord = data.value;
        } catch(e) {
            console.log(e);
            linksRecord = {
                links: []
            };
        }

        return <LinksForm action={linksAction} initialData={linksRecord} />
    }
}

export default EditPage;