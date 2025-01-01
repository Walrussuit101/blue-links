import { Agent, AppBskyActorProfile } from "@atproto/api";
import { getDIDDoc } from "../../../atproto";
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

    return (
        <div className="flex w-screen h-screen justify-center items-center flex-col">
            <UserImage 
                did={didDoc.id} 
                handle={handle} 
                service={didDoc.serviceEndpoint} 
                cid={profile.avatar?.ref.toString()} 
            />
            <p className="text-4xl mt-4">{profile.displayName}</p>
            <small className="text-sm">{handle}</small>
        </div>
    )
}

export default User;