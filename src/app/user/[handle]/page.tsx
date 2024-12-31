import { AppBskyActorProfile } from "@atproto/api";
import { getUnAuthdAgent } from "../../../atProto";
import UserImage from "./UserImage";

// TODO: displayName isn't always defined, if it isn't 'big' name should be handle instead of displayName

interface Props {
    params: Promise<{
        handle: string
    }>
}
const User = async ({ params }: Props) => {
    const handle = (await params).handle;
    const { agent, did, service } = await getUnAuthdAgent(handle);
    
    const profileRecord = await agent.com.atproto.repo.getRecord({
        repo: did,
        collection: 'app.bsky.actor.profile',
        rkey: 'self'
    });
    const profile = profileRecord.data.value as AppBskyActorProfile.Record;

    return (
        <div className="flex w-screen h-screen justify-center items-center flex-col">
            <UserImage 
                did={did} 
                handle={handle} 
                service={service} 
                cid={profile.avatar?.ref.toString()} 
            />
            <p className="text-4xl mt-4">{profile.displayName}</p>
            <small className="text-sm">{handle}</small>
        </div>
    )
}

export default User;