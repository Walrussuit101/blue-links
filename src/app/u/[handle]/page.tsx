import { AppBskyActorProfile } from "@atproto/api";
import { getBlueLinksAgent, getDIDDoc } from "../../../atproto";
import UserImage from "./UserImage";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import * as Links from '@/lexicon/types/fyi/bluelinks/links';
import AuthGuard from "@/components/AuthGuard";

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

    const agent = getBlueLinksAgent(didDoc.serviceEndpoint);

    const profileRecord = await agent.com.atproto.repo.getRecord({
        repo: didDoc.id,
        collection: 'app.bsky.actor.profile',
        rkey: 'self'
    });
    const profile = profileRecord.data.value as AppBskyActorProfile.Record;

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
        <AuthGuard navbar optional>
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
                    linksRecord.links.length === 0 &&
                    <p className="mt-8 text-lg">No links to show :(</p>
                }
                {
                    linksRecord.links.length > 0 &&
                    <ul className="mt-4 w-full sm:w-1/2 lg:w-1/4">
                        {
                            linksRecord.links.toSorted((a, b) => a.order - b.order).map(link => {
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
        </AuthGuard>
    )
}

export default User;

export const dynamicParams = true;
export const revalidate = false;
export const generateStaticParams = async () => [];

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const handle = (await params).handle;

    return {
        title: `${handle} | Blue Links`
    }
}