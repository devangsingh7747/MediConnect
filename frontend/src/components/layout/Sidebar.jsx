import { NavLink, useNavigate } from "react-router-dom";

import {
    FaHome,
    FaUserInjured,
    FaUserMd,
    FaCalendarCheck,
    FaSignOutAlt
} from "react-icons/fa";

const Sidebar = () => {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("token");

        navigate("/");

    };

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
            isActive
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-blue-100"
        }`;

    return (

        <div className="w-64 h-screen bg-white shadow-lg p-5">

            <h1 className="text-3xl font-bold text-blue-600 mb-8">
                MediConnect
            </h1>

            <nav className="space-y-2">

                <NavLink
                    to="/home"
                    className={linkClass}
                >
                    <FaHome />
                    Dashboard
                </NavLink>

                <NavLink
                    to="/dashboard"
                    className={linkClass}
                >
                    <FaUserInjured />
                    Patients
                </NavLink>

                <NavLink
                    to="/doctor-dashboard"
                    className={linkClass}
                >
                    <FaUserMd />
                    Doctors
                </NavLink>

                <NavLink
                    to="/appointment-dashboard"
                    className={linkClass}
                >
                    <FaCalendarCheck />
                    Appointments
                </NavLink>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-100 w-full transition"
                >
                    <FaSignOutAlt />
                    Logout
                </button>

            </nav>

        </div>

    );

};

export default Sidebar;