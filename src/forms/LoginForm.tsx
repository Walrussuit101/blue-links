'use client';
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

interface Props {
    action: (prevState: any, formData: FormData) => void
}
const LoginForm = ({ action }: Props) => {
    const [state, formAction] = useActionState(action, null);

    return (
        <form action={formAction} className="flex w-screen h-screen justify-center items-center flex-col">
            <input 
                style={{ color: 'black' }}
                type="text" 
                placeholder="Handle"
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
        <button disabled={pending} type="submit">
            {pending ? 'Logging you in...' : 'Log In'}
        </button>
    )
}

export default LoginForm;