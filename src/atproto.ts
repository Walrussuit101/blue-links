import { DidDocument, DidResolver, HandleResolver } from "@atproto/identity"

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