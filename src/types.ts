export const LinkCollection = 'info.timjefferson.dev.blue-links.links'

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