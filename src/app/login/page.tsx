import { loginAction } from "@/actions/loginAction";
import LoginForm from "@/forms/LoginForm";

const Login = async () => {
    return (
        <LoginForm action={loginAction}/>
    )
}

export default Login;