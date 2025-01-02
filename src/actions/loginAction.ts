import { createAuthClient } from "@/auth/client";
import { redirect } from "next/navigation";

export const loginAction = async (prevState: any, formData: FormData) => {
    'use server';

    const handle = formData.get('handle');

    if (!handle) {
        throw new Error('Handle was not provided');
    }

    const authClient = await createAuthClient();
    const url = await authClient.authorize(handle.toString(), {
        scope: 'atproto transition:generic'
    });
    
    redirect(url.toString());
}