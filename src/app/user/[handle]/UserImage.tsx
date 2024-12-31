'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Agent } from '@atproto/api';

interface Props {
    did: string
    handle: string
    service: string
    cid: string
}
const UserImage = ({ did, service, handle, cid }: Props) => {
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        const load  = async () => {
            const agent = new Agent(service);

            const avatarBlob = await agent.com.atproto.sync.getBlob({
                did: did,
                cid: cid
            });

            const blobUrl = URL.createObjectURL(new Blob([avatarBlob.data]));
            setUrl(blobUrl);
        }

        load();
    }, [])

    if (url === null) {
        return (
            <div className='w-[175px] h-[175px] bg-black' />
        )
    }

    return (
        <Image
            className='rounded-full'
            src={url}
            alt={handle}
            height={175}
            width={175}
        />
    )
}

export default UserImage;