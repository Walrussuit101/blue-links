'use client';

import { LinkData } from "@/types";
import { ChangeEvent, useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { v4 as uuidv4 } from 'uuid';

interface Props {
    action: (prevState: any, formData: FormData) => void
    initialData: LinkData[];
}
const LinksForm = ({ action, initialData }: Props) => {
    const [state, formAction] = useActionState(action, null);
    const [linkData, setLinkData] = useState<LinkData[]>(structuredClone(initialData));

    const moveUp = (order: number) => {
        if (order > 1) {
            setLinkData(prevLinks => {
                const newLinks = prevLinks.map(link => {
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
                });

                return validateOrder(newLinks);
            });
        }
    }

    const moveDown = (order: number) => {
        if (order < linkData.length) {
            setLinkData(prevLinks => {
                const newLinks = prevLinks.map(link => {
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
                });

                return validateOrder(newLinks);
            });
        }
    }

    const addLink = () => {
        setLinkData(prev => {
            return validateOrder(prev.concat({
                id: uuidv4(),
                name: "New Link",
                order: prev.length + 1,
                url: 'https://example.com',
                createdAt: new Date()
            }))
        })
    }

    const removeLink = (id: string) => {
        setLinkData(prev => {
            return validateOrder(prev.filter(link => link.id !== id));
        })
    }

    const contentChange = (id: string, event: ChangeEvent<HTMLInputElement>) => {
        setLinkData(prev => {
            return prev.map(link => {
                if (link.id === id) {
                    return {
                        ...link,
                        [event.target.name]: event.target.value
                    }
                }

                return link;
            })
        })
    }

    return (
        <form action={formAction} className="flex w-full justify-start items-center flex-col gap-10 pt-10">
            {
                linkData.map((link, i) => {
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
                                />
                            </div>
                            <input
                                name="url"
                                onChange={e => contentChange(link.id, e)}
                                value={link.url}
                                className="w-full h-8 text-black px-2"
                                placeholder="Link (https://github.com)"
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
            </div>
            <input name="data" type="hidden" value={JSON.stringify(linkData)} />
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
    const validateOrder = (linksData: LinkData[]) => {
        const sorted = linksData.sort((a, b) => a.order - b.order);
    
        for (let i = 0; i < sorted.length; i++) {
            if (i === 0 && sorted[i].order !== 1) {
                sorted[i].order = 1
            }
    
            if (i > 0 && sorted[i].order <= sorted[i-1].order) {
                sorted[i].order = sorted[i-1].order + 1;
            }
    
            if (i === sorted.length - 1 && sorted[i].order !== sorted.length) {
                sorted[i].order = sorted.length;
            }
        }
    
        return sorted;
    }

export default LinksForm;