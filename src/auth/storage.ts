import { NodeSavedSession, NodeSavedSessionStore, NodeSavedState, NodeSavedStateStore } from "@atproto/oauth-client-node";
import { cookies } from "next/headers";

export class StateStore implements NodeSavedStateStore {
    constructor() { }

    async get(key: string): Promise<NodeSavedState | undefined> {
        const cookieStore = await cookies();

        const cookie = cookieStore.get(key);

        if (!cookie) {
            return undefined;
        } else {
            return JSON.parse(cookie.value) as NodeSavedState;
        }
    }

    async set(key: string, value: NodeSavedState): Promise<void> {
        const cookieStore = await cookies();

        const asString = JSON.stringify(value);

        cookieStore.set(key, asString);
    }

    async del (key: string): Promise<void> {
        const cookieStore = await cookies();

        cookieStore.delete(key);
    }
}

export class SessionStore implements NodeSavedSessionStore {
    constructor() { }

    async get(key: string): Promise<NodeSavedSession | undefined> {
        const cookieStore = await cookies();

        const cookie = cookieStore.get(key);

        if (!cookie) {
            return undefined;
        } else {
            return JSON.parse(cookie.value) as NodeSavedSession;
        }
    }

    async set(key: string, value: NodeSavedSession): Promise<void> {
        const cookieStore = await cookies();

        const asString = JSON.stringify(value);

        cookieStore.set(key, asString);
    }

    async del (key: string): Promise<void> {
        const cookieStore = await cookies();

        cookieStore.delete(key);
    }
}