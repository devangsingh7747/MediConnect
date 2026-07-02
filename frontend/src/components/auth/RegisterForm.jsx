import { FaUserPlus } from "react-icons/fa";

const RegisterForm = () => {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

            <div className="flex justify-center mb-4">
                <FaUserPlus className="text-5xl text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-center text-gray-800">
                Create Account
            </h1>

            <p className="text-center text-gray-500 mt-2">
                Register to use MediConnect
            </p>

        </div>
    );
};

export default RegisterForm;