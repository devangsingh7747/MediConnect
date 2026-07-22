import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import NotificationDropdown from "../notifications/NotificationDropdown";
import { getNotificationCount } from "../../services/notificationService";

const Header = () => {

    const [showNotifications, setShowNotifications] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);

    const notificationRef = useRef(null);

    const loadNotificationCount = async () => {

        try {

            const count = await getNotificationCount();

            setNotificationCount(count);

        } catch (error) {

            console.error(error);

        }

    };

    useEffect(() => {

        loadNotificationCount();

        const interval = setInterval(() => {

            loadNotificationCount();

        }, 3000);

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

            clearInterval(interval);

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);

    return (

        <header className="bg-white shadow-md rounded-xl p-4 flex justify-between items-center mb-6">

            <h1 className="text-2xl font-bold text-blue-600">

                🏥 MediConnect Admin

            </h1>

            <div className="flex items-center gap-6">

                <div
                    className="relative"
                    ref={notificationRef}
                >

                    <button
                        onClick={() => {

                            setShowNotifications(prev => !prev);

                            loadNotificationCount();

                        }}
                        className="relative p-2 rounded-full hover:bg-gray-100 transition"
                    >

                        <Bell size={24} />

                        <span
                            className="
                                absolute
                                -top-1
                                -right-1
                                bg-red-500
                                text-white
                                text-xs
                                rounded-full
                                h-5
                                w-5
                                flex
                                items-center
                                justify-center
                            "
                        >

                            {notificationCount}

                        </span>

                    </button>

                    <div
                        className={`
                            absolute
                            right-0
                            mt-3
                            z-50
                            transition-all
                            duration-300
                            origin-top-right
                            ${
                                showNotifications
                                    ? "opacity-100 scale-100 visible"
                                    : "opacity-0 scale-95 invisible"
                            }
                        `}
                    >

                        <NotificationDropdown />

                    </div>

                </div>

                <div className="font-semibold">

                    Admin

                </div>

            </div>

        </header>

    );

};

export default Header;