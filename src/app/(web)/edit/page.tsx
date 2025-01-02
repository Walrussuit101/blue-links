import { restoreSession } from "@/atproto";
import { createAuthClient } from "@/auth/client";
import { cookies } from "next/headers"
import { redirect } from "next/navigation";

const EditPage = async () => {
    const cookieStore = await cookies();
    const authClient = await createAuthClient();

    const did = cookieStore.get('did');
    const session = await restoreSession(authClient, did?.value);

    if (!session) {
        return redirect('/login');
    } else {
        return <p>hello authd user</p>
    }
}

export default EditPage;