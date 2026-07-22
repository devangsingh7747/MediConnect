import { NavLink, useNavigate } from "react-router-dom";
import {
    CalendarDays,
    LayoutDashboard,
    LogOut,
    Stethoscope,
    UserRound,
    Bell,
} from "lucide-react";

const DoctorSidebar = () => {
    const navigate = useNavigate();

    const menuItems = [
        {
            name: "Dashboard",
            path: "/doctor/home",
            icon: LayoutDashboard,
        },
        {
            name: "Appointments",
            path: "/doctor/appointments",
            icon: CalendarDays,
        },
        {
            name: "Notifications",
            path: "/doctor/notifications",
            icon: Bell,
        },
        {
            name: "Profile",
            path: "/doctor/profile",
            icon: UserRound,
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/", {
            replace: true,
        });
    };

    return (
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white shadow-sm">
            <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-md">
                    <Stethoscope size={23} />
                </div>

                <div>
                    <h1 className="text-xl font-bold text-slate-900">
                        MediConnect
                    </h1>

                    <p className="text-xs font-medium text-slate-500">
                        Doctor Portal
                    </p>
                </div>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
                <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Main Menu
                </p>

                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                                    isActive
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-200 cursor-pointer"
                                        : "text-slate-600 hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
                                }`
                            }
                        >
                            <Icon size={20} />

                            <span>{item.name}</span>
                        </NavLink>
                    );
                })}
            </nav>

            <div className="border-t border-slate-100 p-4">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                    <LogOut size={20} />

                    <span>Logout</span>
                </button>

                <p className="mt-4 text-center text-xs text-slate-400">
                    MediConnect Doctor Portal
                </p>
            </div>
        </aside>
    );
};

export default DoctorSidebar;