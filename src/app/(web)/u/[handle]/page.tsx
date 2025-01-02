import { Agent, AppBskyActorProfile } from "@atproto/api";
import { getDIDDoc } from "../../../../atproto";
import UserImage from "./UserImage";
import { notFound } from "next/navigation";

// TODO: displayName isn't always defined, if it isn't 'big' name should be handle instead of displayName

interface Props {
    params: Promise<{
        handle: string
    }>
}
const User = async ({ params }: Props) => {
    const handle = (await params).handle;
    const didDoc = await getDIDDoc(handle);
    
    if (!didDoc) {
        return notFound();
    }

    const agent = new Agent(didDoc.serviceEndpoint);
    
    const profileRecord = await agent.com.atproto.repo.getRecord({
        repo: didDoc.id,
        collection: 'app.bsky.actor.profile',
        rkey: 'self'
    });
    const profile = profileRecord.data.value as AppBskyActorProfile.Record;

    let links: string[] = []
    try {   
        const linksRecord = await agent.com.atproto.repo.getRecord({
            repo: didDoc.id,
            collection: 'info.timjefferson.dev.blue-links.links',
            rkey: 'self'
        });

        links = linksRecord.data.value as string[];
    } catch(e) {
        links = [];
    }

    return (
        <div className="flex w-screen h-screen justify-start items-center flex-col pt-12">
            <UserImage 
                did={didDoc.id} 
                handle={handle} 
                service={didDoc.serviceEndpoint} 
                cid={profile.avatar?.ref.toString()} 
            />
            <p className="text-4xl mt-4">{profile.displayName}</p>
            <small className="text-sm">{handle}</small>
            {
                links.length === 0 &&
                <p className="mt-8 text-lg">No links to show :(</p>
            }
        </div>
    )
}

export default User;