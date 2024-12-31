import { createClient } from "@/auth/client";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
    const params = new URLSearchParams(req.url.split('?')[1]);

    const authClient = await createClient();
    await authClient.callback(params);

    return redirect('/');
}