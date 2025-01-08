import { linksAction } from "@/actions/linksAction";
import { restoreSession } from "@/atproto";
import { createAuthClient } from "@/auth/client";
import LinksForm from "@/forms/LinksForm";
import { Agent } from "@atproto/api";
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
        const agent = new Agent(session);

        let linksRecord: Links.Record;
        try {
            const response = await agent.com.atproto.repo.getRecord({
                repo: session.did,
                collection: 'fyi.bluelinks.links',
                rkey: 'self'
            });

            if (!Links.isRecord(response.data.value) || !Links.validateRecord(response.data.value).success) {
                throw new Error('Invalid record retrieved');
            }

            linksRecord = response.data.value;
        } catch (e) {
            console.log(e);
            linksRecord = {
                links: []
            };
        }

        return <LinksForm action={linksAction} initialData={linksRecord} />
    }
}

export default EditPage;