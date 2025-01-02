export const LinkCollection = process.env.NODE_ENV === 'development' ? 'info.timjefferson.dev.blue-links.links' : 'fyi.bluelinks.links';

export interface LinkRecord {
    $type: typeof LinkCollection;
    links: LinkData[];
}

export interface LinkData {
    id: string;
    url: string;
    name: string;
    description?: string;
    order: number;
    createdAt: Date;
}