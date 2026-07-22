import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserDoctor } from "react-icons/fa6";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import Input from "../common/Input";
import Button from "../common/Button";
import api from "../../services/api";

const LoginForm = () => {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (event) => {

        event.preventDefault();

        try {

            setLoading(true);

            const response = await api.post("/users/login", {
                email,
                password,
            });

            localStorage.setItem("token", response.data.token);

            const userResponse = await api.get("/users/me");

            const loggedInUser = userResponse.data;

            localStorage.setItem(
                "user",
                JSON.stringify(loggedInUser)
            );

            const normalizedRole = loggedInUser.role
                ?.replace("ROLE_", "")
                .toUpperCase();

            if (normalizedRole === "PATIENT") {

                navigate("/patient/home");

            } else if (normalizedRole === "DOCTOR") {

                navigate("/doctor/home");

            } else if (normalizedRole === "ADMIN") {

                navigate("/home");

            } else {

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                alert("Invalid user role.");

            }

        } catch (error) {

            console.error("Login failed:", error);

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            alert("Invalid email or password.");

        } finally {

            setLoading(false);

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

            <form
                onSubmit={handleLogin}
                className="space-y-5"
            >

                <Input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />

                <div className="relative">

                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword((previous) => !previous)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                    >

                        {showPassword
                            ? <FaEyeSlash />
                            : <FaEye />
                        }

                    </button>

                </div>

                <Button
                    type="submit"
                    disabled={loading}
                >

                    {loading ? "Signing In..." : "Login"}

                </Button>

            </form>

            <p className="text-center mt-6 text-gray-600">

                Don't have an account?{" "}

                <Link
                    to="/register"
                    className="text-blue-600 font-semibold hover:underline"
                >

                    Register

                </Link>

            </p>

        </div>

    );

};

export default LoginForm;