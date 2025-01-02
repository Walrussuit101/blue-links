'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Agent } from '@atproto/api';

interface Props {
    did: string
    handle: string
    service: string
    cid?: string // in the event of no bsky avatar / bsky profile record
}
const UserImage = ({ did, service, handle, cid }: Props) => {
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        const load  = async () => {
            if (cid) {
                const agent = new Agent(service);

                const avatarBlob = await agent.com.atproto.sync.getBlob({
                    did: did,
                    cid: cid
                });
    
                const blobUrl = URL.createObjectURL(new Blob([avatarBlob.data]));
                setUrl(blobUrl);
            }
        }

        load();
    }, [])

    if (url === null) {
        return (
            <div className='rounded-full w-[175px] h-[175px] bg-gradient-to-r from-slate-400 from-10% to-slate-900 outline outline-[6px] outline-zinc-800' />
        )
    }

    return (
        <Image
            className='rounded-full aspect-square object-cover outline outline-[6px] outline-zinc-800'
            src={url}
            alt={handle}
            height={175}
            width={175}
        />
    )
}

export default UserImage;