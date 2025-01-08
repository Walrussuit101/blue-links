'use client';

import { ChangeEvent, useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { v4 as uuidv4 } from 'uuid';
import * as Links from '@/lexicon/types/fyi/bluelinks/links';
import Link from "next/link";

interface Props {
    action: (prevState: any, formData: FormData) => void
    initialData: Links.Record;
}
const LinksForm = ({ action, initialData }: Props) => {
    const [state, formAction] = useActionState(action, null);
    const [linksData, setLinksData] = useState<Links.Record>(structuredClone(initialData));

    const moveUp = (order: number) => {
        if (order > 1) {
            setLinksData(prevLinks => {
                return {
                    links: validateOrder(prevLinks.links.map(link => {
                        let newOrder = link.order;

                        if (link.order === order - 1) {
                            newOrder++;
                        } else if (link.order === order) {
                            newOrder--;
                        }

                        return {
                            ...link,
                            order: newOrder
                        }
                    }))
                }
            });
        }
    }

    const moveDown = (order: number) => {
        if (order < linksData.links.length) {
            setLinksData(prevLinks => {
                return {
                    links: validateOrder(prevLinks.links.map(link => {
                        let newOrder = link.order;

                        if (link.order === order + 1) {
                            newOrder--;
                        } else if (link.order === order) {
                            newOrder++;
                        }

                        return {
                            ...link,
                            order: newOrder
                        }
                    }))
                }
            });
        }
    }

    const addLink = () => {
        setLinksData(prev => {
            return {
                links: validateOrder(prev.links.concat({
                    $type: 'fyi.bluelinks.links#link',
                    id: uuidv4(),
                    name: "New Link",
                    order: prev.links.length + 1,
                    url: 'https://example.com',
                    createdAt: new Date().toISOString()
                }))
            }
        })
    }

    const removeLink = (id: string) => {
        setLinksData(prev => {
            return {
                links: validateOrder(prev.links.filter(link => link.id !== id))
            }
        })
    }

    const contentChange = (id: string, event: ChangeEvent<HTMLInputElement>) => {
        setLinksData(prev => {
            const newLinks = prev.links.map(link => {
                if (link.id === id) {
                    return {
                        ...link,
                        [event.target.name]: event.target.value
                    }
                }

                return link;
            })

            return {
                links: newLinks
            }
        })
    }

    return (
        <form action={formAction} className="flex w-full min-h-full justify-start items-center flex-col gap-10 py-10">
            {
                linksData.links.map((link, i) => {
                    return (
                        <div key={link.id} className="flex flex-col gap-2 px-6 w-full sm:w-3/4 md:w-1/2 lg:w-1/3">
                            <div className="flex flex-row items-center gap-1">
                                <button type="button" onClick={() => moveUp(link.order)} className="h-8 w-8 bg-white text-black">^</button>
                                <button type="button" onClick={() => moveDown(link.order)} className="h-8 w-8 bg-white text-black rotate-180">^</button>
                                <button type="button" onClick={() => removeLink(link.id)} className="h-8 w-8 bg-white text-black">x</button>
                                <span className="w-8 text-center">{link.order}</span>
                                <input
                                    name="name"
                                    onChange={e => contentChange(link.id, e)}
                                    value={link.name}
                                    className="text-black h-8 px-2 w-full"
                                    required
                                />
                            </div>
                            <input
                                name="url"
                                onChange={e => contentChange(link.id, e)}
                                value={link.url}
                                className="w-full h-8 text-black px-2"
                                placeholder="Link (https://github.com)"
                                required
                            />
                            <input
                                name="description"
                                onChange={e => contentChange(link.id, e)}
                                value={link.description ?? ''}
                                className="w-full h-8 text-black px-2"
                                placeholder="Description (optional)"
                            />
                        </div>
                    )
                })
            }
            <div className="flex flex-col gap-2">
                <button type="button" onClick={addLink} className="bg-white text-black h-8 w-64">Add Link</button>
                <Submit />
                <Link href="/confirm/delete" className="mt-5">
                    <button type="button" className="bg-red-500 text-black h-8 w-64">Delete Data</button>
                </Link>
            </div>
            <input name="data" type="hidden" value={JSON.stringify(addTypeToLinks(linksData.links))} />
        </form>
    )
}

const Submit = () => {
    const { pending } = useFormStatus();

    return (
        <button
            className="bg-white text-black h-8 w-64 disabled:bg-zinc-400"
            disabled={pending}
            type="submit"
        >
            {pending ? 'Saving...' : 'Save'}
        </button>
    )
}


/*
    Sometimes you can lose an order index, like order 1 for example:
    If user has 1 link, with order = 1
    adds a second link, with order = 2
    remove the 1st link, only link with order = 2 will remain.

    this can break things, for example:
    adding a link after this will cause it to have order = 2, then user has two link with order 2
 */
const validateOrder = (linksData: Links.Link[]) => {
    const sorted = linksData.sort((a, b) => a.order - b.order);

    for (let i = 0; i < sorted.length; i++) {
        if (i === 0 && sorted[i].order !== 1) {
            sorted[i].order = 1
        }

        if (i > 0 && sorted[i].order <= sorted[i - 1].order) {
            sorted[i].order = sorted[i - 1].order + 1;
        }

        if (i === sorted.length - 1 && sorted[i].order !== sorted.length) {
            sorted[i].order = sorted.length;
        }
    }

    return sorted;
}

// The original data saved to user PDS' (before using lexicons) has an array of links
// that didn't have a $type field, but they needed it. so for backwards compat add the field if its missing
const addTypeToLinks = (linksData: Links.Link[]): Links.Link[] => {
    const newLinks = linksData.map(link => {
        if (link.$type === undefined) {
            return {
                ...link, 
                $type: 'fyi.bluelinks.links#link'
            }
        }

        return link;
    })

    return newLinks;
}

export default LinksForm;