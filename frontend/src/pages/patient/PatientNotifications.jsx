import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
    FaBell,
    FaCheckDouble
} from "react-icons/fa";

import PatientLayout from "../../components/patient/PatientLayout";

import {
    getNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead
} from "../../services/notificationService";

const PatientNotifications = () => {

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [markingAll, setMarkingAll] = useState(false);

    const fetchNotifications = async () => {

        if (!user.email) {

            setLoading(false);

            return;

        }

        try {

            const data = await getNotifications(
                user.email
            );

            setNotifications(data);

        } catch (error) {

            console.error(
                "Failed to load notifications:",
                error
            );

            toast.error(
                "Unable to load notifications."
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

    const formatDateTime = (date) => {

        if (!date) {

            return "";

        }

        return new Date(date).toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );

    };

    const handleNotificationClick = async (
        notification
    ) => {

        if (notification.isRead) {

            return;

        }

        try {

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

        } catch (error) {

            console.error(
                "Failed to mark notification as read:",
                error
            );

            toast.error(
                "Unable to update notification."
            );

        }

    };

    const handleMarkAllAsRead = async () => {

        if (!user.email) {

            return;

        }

        try {

            setMarkingAll(true);

            await markAllNotificationsAsRead(
                user.email
            );

            setNotifications(
                (previousNotifications) =>
                    previousNotifications.map(
                        (notification) => ({
                            ...notification,
                            isRead: true
                        })
                    )
            );

            toast.success(
                "All notifications marked as read."
            );

        } catch (error) {

            console.error(
                "Failed to mark all notifications as read:",
                error
            );

            toast.error(
                "Unable to mark notifications as read."
            );

        } finally {

            setMarkingAll(false);

        }

    };

    const unreadCount = notifications.filter(
        (notification) =>
            !notification.isRead
    ).length;

    return (

        <PatientLayout>

            <div className="space-y-6">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div>

                        <h1 className="text-3xl font-bold text-gray-800">

                            Notifications

                        </h1>

                        <p className="text-gray-500 mt-2">

                            View your latest MediConnect updates.

                        </p>

                    </div>

                    {unreadCount > 0 && (

                        <button
                            type="button"
                            onClick={handleMarkAllAsRead}
                            disabled={markingAll}
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                bg-blue-600
                                hover:bg-blue-700
                                disabled:bg-blue-300
                                text-white
                                font-semibold
                                px-5
                                py-3
                                rounded-xl
                                transition
                                cursor-pointer
                                disabled:cursor-not-allowed
                            "
                        >

                            <FaCheckDouble />

                            {markingAll
                                ? "Updating..."
                                : "Mark All as Read"
                            }

                        </button>

                    )}

                </div>

                <div className="bg-white rounded-2xl shadow overflow-hidden">

                    <div className="flex items-center justify-between p-6 border-b">

                        <div>

                            <h2 className="text-xl font-bold text-gray-800">

                                Recent Notifications

                            </h2>

                            <p className="text-sm text-gray-500 mt-1">

                                {unreadCount} unread notification
                                {unreadCount === 1 ? "" : "s"}

                            </p>

                        </div>

                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">

                            <FaBell className="text-xl" />

                        </div>

                    </div>

                    {loading ? (

                        <div className="text-center py-16">

                            <p className="text-gray-500">

                                Loading notifications...

                            </p>

                        </div>

                    ) : notifications.length === 0 ? (

                        <div className="text-center py-16 px-6">

                            <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto">

                                <FaBell className="text-4xl" />

                            </div>

                            <h3 className="text-xl font-bold text-gray-800 mt-5">

                                No Notifications Yet

                            </h3>

                            <p className="text-gray-500 mt-2">

                                We'll notify you whenever something important happens.

                            </p>

                        </div>

                    ) : (

                        <div>

                            {notifications.map(
                                (notification) => (

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
                                            p-6
                                            border-b
                                            last:border-b-0
                                            transition-all
                                            cursor-pointer
                                            ${
                                                notification.isRead
                                                    ? "bg-white hover:bg-gray-50"
                                                    : "bg-blue-50 hover:bg-blue-100"
                                            }
                                        `}
                                    >

                                        <div className="flex items-start gap-4">

                                            <div
                                                className={`
                                                    mt-2
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

                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">

                                                    <h3
                                                        className={`
                                                            text-lg
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

                                                    <span className="text-xs text-gray-400 whitespace-nowrap">

                                                        {formatDateTime(
                                                            notification.createdAt
                                                        )}

                                                    </span>

                                                </div>

                                                <p className="text-gray-600 mt-2">

                                                    {notification.message}

                                                </p>

                                                <span className="inline-block mt-3 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">

                                                    {notification.type
                                                        ?.replaceAll("_", " ")
                                                    }

                                                </span>

                                            </div>

                                        </div>

                                    </button>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>

        </PatientLayout>

    );

};

export default PatientNotifications;