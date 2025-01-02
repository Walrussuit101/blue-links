import { loginAction } from "@/actions/loginAction";
import LoginForm from "@/forms/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Login | Blue Links'
}

const Login = async () => {
    return (
        <LoginForm action={loginAction}/>
    )
}

export default Login;