import { NavLink, useNavigate } from "react-router-dom";

import {
    FaHome,
    FaCalendarCheck,
    FaStethoscope,
    FaBell,
    FaUser,
    FaSignOutAlt
} from "react-icons/fa";

const PatientSidebar = () => {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");

    };

    const linkClass = ({ isActive }) => `
        flex
        items-center
        gap-3
        px-4
        py-3
        rounded-xl
        font-medium
        transition-all
        duration-200
        ${
            isActive
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
        }
    `;

    return (

        <aside className="h-screen bg-white shadow-lg p-5 flex flex-col">

            <div className="mb-10">

                <h1 className="text-2xl font-bold text-blue-600">

                    🏥 MediConnect

                </h1>

                <p className="text-sm text-gray-500 mt-1">

                    Patient Portal

                </p>

            </div>

            <nav className="space-y-2">

                <NavLink
                    to="/patient/home"
                    className={linkClass}
                >

                    <FaHome />

                    Dashboard

                </NavLink>

                <NavLink
                    to="/appointment"
                    className={linkClass}
                >

                    <FaCalendarCheck />

                    Book Appointment

                </NavLink>

                <NavLink
                    to="/patient/appointments"
                    className={linkClass}
                >

                    <FaCalendarCheck />

                    My Appointments

                </NavLink>

                <NavLink
                    to="/patient/disease-analysis"
                    className={linkClass}
                >

                    <FaStethoscope />

                    Disease Analysis

                </NavLink>

                <NavLink
                    to="/patient/notifications"
                    className={linkClass}
                >

                    <FaBell />

                    Notifications

                </NavLink>

                <NavLink
                    to="/patient/profile"
                    className={linkClass}
                >

                    <FaUser />

                    Profile

                </NavLink>

            </nav>

            <button
                type="button"
                onClick={handleLogout}
                className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition cursor-pointer"
            >

                <FaSignOutAlt />

                Logout

            </button>

        </aside>

    );

};

export default PatientSidebar;