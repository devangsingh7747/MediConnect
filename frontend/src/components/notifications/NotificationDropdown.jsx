import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getLatestNotifications,
    markNotificationAsRead
} from "../../services/notificationService";

const NotificationDropdown = () => {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {

        if (!user.email) {

            setLoading(false);

            return;

        }

        try {

            const data = await getLatestNotifications(
                user.email
            );

            setNotifications(data);

        } catch (error) {

            console.error(
                "Failed to fetch notifications:",
                error
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchNotifications();

        const interval = setInterval(() => {

            fetchNotifications();

        }, 3000);

        return () => {

            clearInterval(interval);

        };

    }, [user.email]);

    const formatTime = (date) => {

        if (!date) {

            return "";

        }

        const now = new Date();
        const notificationTime = new Date(date);

        const differenceInSeconds = Math.floor(
            (now - notificationTime) / 1000
        );

        if (differenceInSeconds < 60) {

            return "Just now";

        }

        if (differenceInSeconds < 3600) {

            return `${Math.floor(
                differenceInSeconds / 60
            )} min ago`;

        }

        if (differenceInSeconds < 86400) {

            return `${Math.floor(
                differenceInSeconds / 3600
            )} hr ago`;

        }

        return `${Math.floor(
            differenceInSeconds / 86400
        )} day ago`;

    };

    const handleNotificationClick = async (notification) => {

        try {

            if (!notification.isRead) {

                await markNotificationAsRead(
                    notification.id
                );

                setNotifications(
                    (previousNotifications) =>
                        previousNotifications.map(
                            (currentNotification) =>
                                currentNotification.id ===
                                notification.id
                                    ? {
                                        ...currentNotification,
                                        isRead: true
                                    }
                                    : currentNotification
                        )
                );

            }

        } catch (error) {

            console.error(
                "Failed to mark notification as read:",
                error
            );

        }

    };

    return (

        <div className="w-96 bg-white rounded-xl shadow-xl border overflow-hidden">

            <div className="flex items-center justify-between p-4 border-b">

                <h2 className="text-lg font-bold">

                    🔔 Notifications

                </h2>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/patient/notifications")
                    }
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                >

                    View All

                </button>

            </div>

            <div className="max-h-[450px] overflow-y-auto">

                {loading ? (

                    <div className="text-center py-10">

                        <p className="text-gray-500">

                            Loading notifications...

                        </p>

                    </div>

                ) : notifications.length === 0 ? (

                    <div className="text-center py-10 px-4">

                        <p className="text-4xl">

                            🔔

                        </p>

                        <p className="text-gray-500 mt-2">

                            You're all caught up!

                        </p>

                    </div>

                ) : (

                    notifications.map((notification) => (

                        <button
                            key={notification.id}
                            type="button"
                            onClick={() =>
                                handleNotificationClick(
                                    notification
                                )
                            }
                            className={`
                                w-full
                                text-left
                                p-4
                                border-b
                                last:border-b-0
                                transition
                                cursor-pointer
                                ${
                                    notification.isRead
                                        ? "bg-white hover:bg-gray-50"
                                        : "bg-blue-50 hover:bg-blue-100"
                                }
                            `}
                        >

                            <div className="flex items-start gap-3">

                                <div
                                    className={`
                                        mt-1
                                        w-3
                                        h-3
                                        rounded-full
                                        shrink-0
                                        ${
                                            notification.isRead
                                                ? "bg-gray-300"
                                                : "bg-blue-600"
                                        }
                                    `}
                                />

                                <div className="flex-1">

                                    <h3
                                        className={`
                                            text-gray-800
                                            ${
                                                notification.isRead
                                                    ? "font-medium"
                                                    : "font-bold"
                                            }
                                        `}
                                    >

                                        {notification.title}

                                    </h3>

                                    <p className="text-sm text-gray-600 mt-1">

                                        {notification.message}

                                    </p>

                                    <p className="text-xs text-gray-400 mt-2">

                                        {formatTime(
                                            notification.createdAt
                                        )}

                                    </p>

                                </div>

                            </div>

                        </button>

                    ))

                )}

            </div>

        </div>

    );

};

export default NotificationDropdown;