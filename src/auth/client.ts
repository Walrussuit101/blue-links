import { NodeOAuthClient } from '@atproto/oauth-client-node'
import { SessionStore, StateStore } from './storage'

export const createAuthClient = async () => {
    const url = process.env.ATPROTO_OAUTH_URL;
    const isLocal = url?.includes('http://127.0.0.1');

    return new NodeOAuthClient({
        clientMetadata: {
            client_name: 'Blue Links',
            client_id: !isLocal
                // if the app is deployed, use the client-metadata.json resource
                ? `${url}/client-metadata.json`
                
                // localhost doesn't require a client-metadata.json resource and can just define them through query params
                // see "Localhost Client Development" in the atproto oauth docs
                : `http://localhost?redirect_uri=${encodeURIComponent(`${url}/oauth/callback`)}&scope=${encodeURIComponent('atproto transition:generic')}`,
            client_uri: url,
            redirect_uris: [`${url}/oauth/callback`],
            scope: 'atproto transition:generic',
            grant_types: ['authorization_code', 'refresh_token'],
            response_types: ['code'],
            application_type: 'web',
            token_endpoint_auth_method: 'none',
            dpop_bound_access_tokens: true,
        },
        stateStore: new StateStore(),
        sessionStore: new SessionStore()
    })
}
