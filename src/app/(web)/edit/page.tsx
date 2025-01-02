import { linksAction } from "@/actions/linksAction";
import { restoreSession } from "@/atproto";
import { createAuthClient } from "@/auth/client";
import LinksForm from "@/forms/LinksForm";
import { LinkCollection, LinkData, LinkRecord } from "@/types";
import { Agent } from "@atproto/api";
import { Metadata } from "next";
import { cookies } from "next/headers"
import { redirect } from "next/navigation";

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

        let links: LinkData[] = []
        try {
            const linksRecord = await agent.com.atproto.repo.getRecord({
                repo: session.did,
                collection: LinkCollection,
                rkey: 'self'
            });

            links = (linksRecord.data.value as LinkRecord).links;
        } catch (e) {
            links = [];
        }

        return <LinksForm action={linksAction} initialData={links} />
    }
}

export default EditPage;