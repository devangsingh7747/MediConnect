import { Bell, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import NotificationDropdown from "../notifications/NotificationDropdown";

import {
    getNotificationCount
} from "../../services/notificationService";

const PatientHeader = () => {

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const [showNotifications, setShowNotifications] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);

    const notificationRef = useRef(null);

    const loadNotificationCount = async () => {

        if (!user.email) {

            setNotificationCount(0);

            return;

        }

        try {

            const count = await getNotificationCount(
                user.email
            );

            setNotificationCount(count);

        } catch (error) {

            console.error(
                "Failed to load notification count:",
                error
            );

        }

    };

    useEffect(() => {

        loadNotificationCount();

        const interval = setInterval(() => {

            loadNotificationCount();

        }, 3000);

        return () => {

            clearInterval(interval);

        };

    }, [user.email]);

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {

                setShowNotifications(false);

            }

        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);

    const handleBellClick = () => {

        setShowNotifications(
            (previousValue) => !previousValue
        );

        loadNotificationCount();

    };

    return (

        <header className="bg-white rounded-xl shadow p-4 flex items-center justify-between mb-6">

            <div>

                <h2 className="text-2xl font-bold text-gray-800">

                    Welcome, {user.fullName || "Patient"} 👋

                </h2>

                <p className="text-sm text-gray-500 mt-1">

                    Manage your health and appointments from one place.

                </p>

            </div>

            <div className="flex items-center gap-4">

                <div
                    className="relative"
                    ref={notificationRef}
                >

                    <button
                        type="button"
                        onClick={handleBellClick}
                        className="relative p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
                    >

                        <Bell size={22} />

                        {notificationCount > 0 && (

                            <span
                                className="
                                    absolute
                                    -top-1
                                    -right-1
                                    min-w-5
                                    h-5
                                    px-1
                                    bg-red-500
                                    text-white
                                    text-xs
                                    font-semibold
                                    rounded-full
                                    flex
                                    items-center
                                    justify-center
                                "
                            >

                                {notificationCount > 99
                                    ? "99+"
                                    : notificationCount
                                }

                            </span>

                        )}

                    </button>

                    {showNotifications && (

                        <div className="absolute right-0 mt-3 z-50">

                            <NotificationDropdown />

                        </div>

                    )}

                </div>

                <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">

                        <UserRound size={21} />

                    </div>

                    <div>

                        <p className="font-semibold text-gray-800">

                            {user.fullName || "Patient"}

                        </p>

                        <p className="text-xs text-gray-500">

                            Patient

                        </p>

                    </div>

                </div>

            </div>

        </header>

    );

};

export default PatientHeader;