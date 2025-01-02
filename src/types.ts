export interface LinkRecord {
    $type: 'info.timjefferson.dev.blue-links.links',
    links: LinkData[]
}

export interface LinkData {
    id: string;
    url: string;
    name: string;
    description?: string;
    order: number;
    createdAt: Date;
}