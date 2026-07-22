import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";

import api from "../../services/api";
import Input from "../common/Input";
import Button from "../common/Button";

const RegisterForm = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({

        fullName: "",
        email: "",
        password: "",
        role: "PATIENT"

    });

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({

            ...prev,
            [name]: value

        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await api.post("/users/register", formData);

            alert("Registration Successful!");

            navigate("/");

        }

        catch (error) {

            console.error(error);

            if (error.response?.status === 409) {

                alert("Email already registered.");

            }

            else {

                alert("Registration Failed!");

            }

        }

    };

    return (

        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

            <div className="flex justify-center mb-4">

                <FaUserPlus className="text-5xl text-green-600" />

            </div>

            <h1 className="text-3xl font-bold text-center text-gray-800">

                Create Account

            </h1>

            <p className="text-center text-gray-500 mt-2 mb-6">

                Register to use MediConnect

            </p>

            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >

                <Input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                />

                <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <div>

                    <label className="block mb-2 font-semibold text-gray-700">

                        Register As

                    </label>

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >

                        <option value="PATIENT">

                            👤 Patient

                        </option>

                        <option value="DOCTOR">

                            👨‍⚕️ Doctor

                        </option>

                    </select>

                </div>

                <Button type="submit">

                    Register

                </Button>

            </form>

            <p className="text-center text-gray-600 mt-6">

                Already have an account?{" "}

                <Link
                    to="/"
                    className="text-blue-600 font-semibold"
                >

                    Login

                </Link>

            </p>

        </div>

    );

};

export default RegisterForm;