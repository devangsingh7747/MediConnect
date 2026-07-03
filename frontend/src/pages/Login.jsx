import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import LoginForm from "../components/auth/LoginForm";

const Login = () => {

    const navigate = useNavigate();

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (token) {
            navigate("/home");
        }

    }, [navigate]);

    return (

        <div className="min-h-screen flex items-center justify-center bg-slate-100">

            <LoginForm />

        </div>

    );

};

export default Login;