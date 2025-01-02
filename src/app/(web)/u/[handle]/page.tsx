import { Agent, AppBskyActorProfile } from "@atproto/api";
import { getDIDDoc, restoreSession } from "../../../../atproto";
import UserImage from "./UserImage";
import { notFound } from "next/navigation";
import { LinkCollection, LinkData, LinkRecord } from "@/types";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { createAuthClient } from "@/auth/client";
import Link from "next/link";

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const handle = (await params).handle;

    return {
        title: `${handle} | Blue Links`
    }
}

interface Props {
    params: Promise<{
        handle: string
    }>
}
const User = async ({ params }: Props) => {
    const cookieStore = await cookies();
    const authClient = await createAuthClient();
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

    let links: LinkData[] = []
    try {
        const linksRecord = await agent.com.atproto.repo.getRecord({
            repo: didDoc.id,
            collection: LinkCollection,
            rkey: 'self'
        });

        links = (linksRecord.data.value as LinkRecord).links;
    } catch (e) {
        links = [];
    }

    const did = cookieStore.get('did');
    const session = await restoreSession(authClient, did?.value);
    const isSelf = session?.did === didDoc.id;

    return (
        <div className="flex w-full h-full justify-start items-center flex-col pt-12 px-5">
            <UserImage
                did={didDoc.id}
                handle={handle}
                service={didDoc.serviceEndpoint}
                cid={profile.avatar?.ref.toString()} 
            />
            <p className="text-4xl mt-2">{profile.displayName}</p>
            <small className={`text-sm ${profile.displayName === undefined || profile.displayName.length === 0 && 'mt-2'}`}>{handle}</small>
            { 
                isSelf &&
                <Link href="/edit">
                    <button className="bg-white text-black h-8 w-20 mt-4">Edit</button>
                </Link>
            }
            {
                links.length === 0 &&
                <p className="mt-8 text-lg">No links to show :(</p>
            }
            {
                links.length > 0 &&
                <ul className="mt-4 w-full sm:w-1/2 lg:w-1/4">
                    {
                        links.toSorted((a, b) => a.order - b.order).map(link => {
                            return (
                                <li key={link.id} className="text-center mt-2">
                                    <a href={link.url} className="underline text-lg" target="_blank" rel="noreferrer">{link.name}</a>
                                    {
                                        link.description !== undefined &&
                                        <p>{link.description}</p>
                                    }
                                </li>
                            )
                        })
                    }
                </ul>
            }
        </div>
    )
}

export default User;