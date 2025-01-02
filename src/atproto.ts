import { AtUri } from "@atproto/api";
import { DidDocument, DidResolver, HandleResolver } from "@atproto/identity"
import { NodeOAuthClient } from "@atproto/oauth-client-node";

interface DidDocumentWithServiceEndpoint extends DidDocument {
    serviceEndpoint: string
}
export const getDIDDoc = async (handle: string): Promise<DidDocumentWithServiceEndpoint | null> => {
    const resolvers = {
        did: new DidResolver({}),
        handle: new HandleResolver()
    }

    const did = await resolvers.handle.resolve(handle);

    if (!did) {
        console.log(`Could not resolve DID for handle "${handle}"`)
        return null;
    }

    const didDoc = await resolvers.did.resolve(did);

    if (!didDoc) {
        console.log(`Could not resolve DID document for DID "${did}"`);
        return null;
    }

    const service = didDoc?.service?.at(0)?.serviceEndpoint;

    if (typeof service !== 'string') {
        console.log(`Could not determine a service endpoint for DID "${did}"`);
        return null;
    }

    return {
        ...didDoc,
        serviceEndpoint: service
    };
}

export const restoreSession = async (client: NodeOAuthClient, did: string | undefined) => {
    if (!did) {
        return null
    }

    try {
        const session = await client.restore(did);
        return session;
    } catch(e) {
        console.log(e);
        return null;
    }
}

export const getHandleFromDID = async (did: string): Promise<string | null> => {
    const didResolver = new DidResolver({});
    const didDoc = await didResolver.resolve(did);

    if (!didDoc) {
        return null;
    }

    const knownAs = didDoc.alsoKnownAs?.at(0);

    if (!knownAs) {
        return null;
    } else {
        const uri = new AtUri(knownAs);
        return uri.host;
    }
}