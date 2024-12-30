import { Agent } from "@atproto/api";
import { DidResolver, HandleResolver } from "@atproto/identity"

export const getAgent = async (handle: string) => {
    const resolvers = {
        did: new DidResolver({}),
        handle: new HandleResolver()
    }

    const did = await resolvers.handle.resolve(handle) ?? '';
    const didDoc = await resolvers.did.resolve(did);
    const service = didDoc?.service?.at(0)?.serviceEndpoint as string;

    return {
        agent: new Agent(service),
        did: did,
        service: service
    }
}