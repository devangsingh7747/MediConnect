import {
    CheckCheck,
    LoaderCircle,
} from "lucide-react";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
    getLatestNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "../../services/notificationService";

const getSavedUser = () => {
    try {
        return (
            JSON.parse(
                localStorage.getItem("user") || "{}"
            ) || {}
        );
    } catch {
        return {};
    }
};

const NotificationDropdown = ({
    onUnreadCountChange,
}) => {
    const navigate = useNavigate();

    const user = useMemo(
        () => getSavedUser(),
        []
    );

    const [notifications, setNotifications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [markingAll, setMarkingAll] =
        useState(false);

    const fetchNotifications = useCallback(
        async ({
            silent = false,
        } = {}) => {
            if (!user.email) {
                if (!silent) {
                    setLoading(false);
                }

                return;
            }

            try {
                if (!silent) {
                    setLoading(true);
                }

                const data =
                    await getLatestNotifications(
                        user.email
                    );

                const safeNotifications =
                    Array.isArray(data)
                        ? data
                        : [];

                setNotifications(
                    safeNotifications
                );

                const unreadCount =
                    safeNotifications.filter(
                        (notification) =>
                            !notification.isRead
                    ).length;

                onUnreadCountChange?.(
                    unreadCount
                );
            } catch (error) {
                console.error(
                    "Failed to fetch notifications:",
                    error
                );
            } finally {
                if (!silent) {
                    setLoading(false);
                }
            }
        },
        [
            user.email,
            onUnreadCountChange,
        ]
    );

    useEffect(() => {
        fetchNotifications();

        const interval = setInterval(() => {
            fetchNotifications({
                silent: true,
            });
        }, 3000);

        return () => {
            clearInterval(interval);
        };
    }, [fetchNotifications]);

    const unreadCount = useMemo(
        () =>
            notifications.filter(
                (notification) =>
                    !notification.isRead
            ).length,
        [notifications]
    );

    const formatTime = (date) => {
        if (!date) {
            return "";
        }

        const now = new Date();
        const notificationTime =
            new Date(date);

        const differenceInSeconds =
            Math.floor(
                (now - notificationTime) /
                    1000
            );

        if (
            differenceInSeconds < 60
        ) {
            return "Just now";
        }

        if (
            differenceInSeconds < 3600
        ) {
            return `${Math.floor(
                differenceInSeconds / 60
            )} min ago`;
        }

        if (
            differenceInSeconds < 86400
        ) {
            return `${Math.floor(
                differenceInSeconds /
                    3600
            )} hr ago`;
        }

        return `${Math.floor(
            differenceInSeconds / 86400
        )} day ago`;
    };

    const handleNotificationClick =
        async (notification) => {
            if (notification.isRead) {
                return;
            }

            try {
                await markNotificationAsRead(
                    notification.id
                );

                setNotifications(
                    (
                        previousNotifications
                    ) =>
                        previousNotifications.map(
                            (
                                currentNotification
                            ) =>
                                currentNotification.id ===
                                notification.id
                                    ? {
                                          ...currentNotification,
                                          isRead: true,
                                      }
                                    : currentNotification
                        )
                );

                onUnreadCountChange?.(
                    Math.max(
                        0,
                        unreadCount - 1
                    )
                );
            } catch (error) {
                console.error(
                    "Failed to mark notification as read:",
                    error
                );

                toast.error(
                    "Unable to mark notification as read."
                );
            }
        };

    const handleMarkAllRead =
        async () => {
            if (
                !user.email ||
                unreadCount === 0
            ) {
                return;
            }

            try {
                setMarkingAll(true);

                await markAllNotificationsAsRead(
                    user.email
                );

                setNotifications(
                    (
                        previousNotifications
                    ) =>
                        previousNotifications.map(
                            (notification) => ({
                                ...notification,
                                isRead: true,
                            })
                        )
                );

                onUnreadCountChange?.(0);

                toast.success(
                    "All notifications marked as read."
                );
            } catch (error) {
                console.error(
                    "Failed to mark all notifications as read:",
                    error
                );

                toast.error(
                    "Unable to mark all notifications as read."
                );
            } finally {
                setMarkingAll(false);
            }
        };

    return (
        <div className="w-96 overflow-hidden rounded-xl border bg-white shadow-xl">
            <div className="border-b p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold">
                            🔔 Notifications
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                            {unreadCount} unread
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/patient/notifications"
                            )
                        }
                        className="cursor-pointer text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                        View All
                    </button>
                </div>

                <button
                    type="button"
                    onClick={handleMarkAllRead}
                    disabled={
                        markingAll ||
                        unreadCount === 0
                    }
                    className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-50 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {markingAll ? (
                        <>
                            <LoaderCircle
                                size={17}
                                className="animate-spin"
                            />

                            Marking all...
                        </>
                    ) : (
                        <>
                            <CheckCheck
                                size={17}
                            />

                            Mark All as Read
                        </>
                    )}
                </button>
            </div>

            <div className="max-h-[450px] overflow-y-auto">
                {loading ? (
                    <div className="py-10 text-center">
                        <LoaderCircle className="mx-auto h-7 w-7 animate-spin text-blue-600" />

                        <p className="mt-3 text-gray-500">
                            Loading notifications...
                        </p>
                    </div>
                ) : notifications.length ===
                  0 ? (
                    <div className="px-4 py-10 text-center">
                        <p className="text-4xl">
                            🔔
                        </p>

                        <p className="mt-2 text-gray-500">
                            You're all caught up!
                        </p>
                    </div>
                ) : (
                    notifications.map(
                        (notification) => (
                            <button
                                key={
                                    notification.id
                                }
                                type="button"
                                onClick={() =>
                                    handleNotificationClick(
                                        notification
                                    )
                                }
                                className={`w-full cursor-pointer border-b p-4 text-left transition last:border-b-0 ${
                                    notification.isRead
                                        ? "bg-white hover:bg-gray-50"
                                        : "bg-blue-50 hover:bg-blue-100"
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`mt-1 h-3 w-3 shrink-0 rounded-full ${
                                            notification.isRead
                                                ? "bg-gray-300"
                                                : "bg-blue-600"
                                        }`}
                                    />

                                    <div className="flex-1">
                                        <h3
                                            className={`text-gray-800 ${
                                                notification.isRead
                                                    ? "font-medium"
                                                    : "font-bold"
                                            }`}
                                        >
                                            {
                                                notification.title
                                            }
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-600">
                                            {
                                                notification.message
                                            }
                                        </p>

                                        <p className="mt-2 text-xs text-gray-400">
                                            {formatTime(
                                                notification.createdAt
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        )
                    )
                )}
            </div>
        </div>
    );
};

export default NotificationDropdown;