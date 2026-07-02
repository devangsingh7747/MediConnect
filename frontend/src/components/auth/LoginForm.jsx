import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserDoctor } from "react-icons/fa6";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import Input from "../common/Input";
import Button from "../common/Button";

import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const LoginForm = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {

            const response = await api.post("/users/login", {
                email,
                password,
            });

            localStorage.setItem("token", response.data.token);

            navigate("/dashboard");

        } catch (error) {

            alert("Invalid email or password");

            console.error(error);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

            <div className="flex justify-center mb-4">
                <FaUserDoctor className="text-5xl text-blue-600" />
            </div>

            <h1 className="text-3xl font-bold text-center text-gray-800">
                MediConnect
            </h1>

            <p className="text-center text-gray-500 mt-2 mb-8">
                Sign in to continue
            </p>

            <div className="space-y-5">

                <Input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div className="relative">

                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                        {
                            showPassword
                                ? <FaEyeSlash />
                                : <FaEye />
                        }
                    </button>

                </div>

                <Button onClick={handleLogin}>
                    Login
                </Button>

            </div>

            <p className="text-center mt-6 text-gray-600">

                Don't have an account?

                <Link
                    to="/register"
                    className="text-blue-600 font-semibold ml-1 hover:underline"
                >
                    Register
                </Link>

            </p>

        </div>
    );
};

export default LoginForm;