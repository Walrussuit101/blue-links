import { linksAction } from "@/actions/linksAction";
import { getBlueLinksAgent, getDIDDoc } from "@/atproto";
import LinksForm from "@/forms/LinksForm";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import * as Links from '@/lexicon/types/fyi/bluelinks/links';
import AuthGuard from "@/components/AuthGuard";

export const metadata: Metadata = {
    title: 'Edit | Blue Links'
}

interface Props {
    params: Promise<{
        handle: string
    }>
}
const EditPage = async ({ params }: Props) => {
    const handle = (await params).handle;
    const didDoc = await getDIDDoc(handle);

    if (!didDoc) {
        return notFound();
    }

    // get link data from user
    const agent = getBlueLinksAgent(didDoc.serviceEndpoint);

    let linksRecord: Links.Record;
    try {
        const data = await agent.fyi.bluelinks.links.get({
            repo: didDoc.id,
            rkey: 'self'
        });

        linksRecord = data.value;
    } catch (e) {
        console.log(e);
        linksRecord = {
            links: []
        };
    }

    return (
        <AuthGuard enforceSelfDID={didDoc.id} navbar>
            <LinksForm action={linksAction} initialData={linksRecord} />
        </AuthGuard>
    )
}

export default EditPage;