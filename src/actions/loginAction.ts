import { createClient } from "@/auth/client";
import { redirect } from "next/navigation";

export const loginAction = async (prevState: any, formData: FormData) => {
    'use server';

    const handle = formData.get('handle');

    // TODO: handle no handle given
    if (!handle) {
        return;
    }

    const authClient = await createClient();
    const url = await authClient.authorize(handle.toString(), {
        scope: 'atproto transition:generic'
    });
    
    redirect(url.toString());
}