'use client';
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

interface Props {
    action: (prevState: any, formData: FormData) => void
}
const LoginForm = ({ action }: Props) => {
    const [state, formAction] = useActionState(action, null);

    return (
        <form action={formAction} className="flex w-full h-full justify-center items-center flex-col">
            <p className="text-2xl">Blue Links</p>
            <input 
                className="text-black h-8 w-64 px-2 mb-3 mt-1"
                type="text" 
                placeholder="Handle (john.bsky.social)"
                name="handle"
                required
                autoFocus
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