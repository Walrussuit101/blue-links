'use client';
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

interface Props {
    action: (prevState: any, formData: FormData) => void
}
const LoginForm = ({ action }: Props) => {
    const [state, formAction] = useActionState(action, null);

    return (
        <form action={formAction} className="flex w-screen h-screen justify-center items-center flex-col gap-4">
            <input 
                className="text-black h-8 w-64 px-2"
                type="text" 
                placeholder="Handle (john.bsky.social)"
                name="handle"
                required
            />
            <Submit />
        </form>
    )
}

const Submit = () => {
    const { pending } = useFormStatus();

    return (
        <button 
            className="bg-white text-black h-8 w-64 disabled:bg-zinc-400"
            disabled={pending} 
            type="submit"
        >
            {pending ? 'Redirecting to PDS...' : 'Log In'}
        </button>
    )
}

export default LoginForm;