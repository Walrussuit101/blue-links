import { createAuthClient } from "@/auth/client"
import { NextResponse } from "next/server";

// Return the client meta data for the application, needed for atproto oauth
export const GET = async () => {
    const authClient = await createAuthClient();

    return NextResponse.json(authClient.clientMetadata, {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}