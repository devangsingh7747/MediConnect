import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Bell,
    CalendarClock,
    CheckCheck,
    CircleX,
    LoaderCircle,
    RefreshCw,
} from "lucide-react";

import { toast } from "react-toastify";

import DoctorLayout from "../../components/doctor/DoctorLayout";

import {
    getAllDoctorNotifications,
    markAllDoctorNotificationsAsRead,
    markDoctorNotificationAsRead,
} from "../../services/doctorService";

const getSavedUser = () => {
    try {
        return (
            JSON.parse(
                localStorage.getItem(
                    "user"
                ) || "{}"
            ) || {}
        );
    } catch {
        return {};
    }
};

const getErrorMessage = (error) => {
    const responseData =
        error?.response?.data;

    if (
        typeof responseData === "string" &&
        responseData.trim()
    ) {
        return responseData;
    }

    if (
        typeof responseData?.message ===
            "string" &&
        responseData.message.trim()
    ) {
        return responseData.message;
    }

    return "Unable to load notifications.";
};

const formatNotificationDate = (
    createdAt
) => {
    if (!createdAt) {
        return "Date unavailable";
    }

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
        return createdAt;
    }

    return date.toLocaleString("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const getNotificationStyle = (
    type
) => {
    switch (type) {
        case "NEW_APPOINTMENT_REQUEST":
            return {
                icon: "📅",
                container:
                    "border-blue-200 bg-blue-50/60",
                iconContainer:
                    "bg-blue-100 text-blue-700",
            };

        case "APPOINTMENT_CANCELLED":
            return {
                icon: "❌",
                container:
                    "border-red-200 bg-red-50/60",
                iconContainer:
                    "bg-red-100 text-red-700",
            };

        default:
            return {
                icon: "🔔",
                container:
                    "border-slate-200 bg-white",
                iconContainer:
                    "bg-slate-100 text-slate-700",
            };
    }
};

const DoctorNotificationsContent = ({
    doctor,
    doctorLoading,
    doctorError,
    reloadDoctor,
}) => {
    const savedUser = useMemo(
        () => getSavedUser(),
        []
    );

    const doctorEmail =
        doctor?.email ||
        savedUser?.email ||
        "";

    const [
        notifications,
        setNotifications,
    ] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [markingAll, setMarkingAll] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState("");


    const loadNotifications = useCallback(
        async ({
            showRefreshLoader = false,
            silent = false,
        } = {}) => {
            if (!doctorEmail) {
                setErrorMessage(
                    "Doctor email was not found."
                );

                if (!silent) {
                    setLoading(false);
                }

                return;
            }

            try {
                if (showRefreshLoader) {
                    setRefreshing(true);
                } else if (!silent) {
                    setLoading(true);
                }

                if (!silent) {
                    setErrorMessage("");
                }

                const response =
                    await getAllDoctorNotifications(
                        doctorEmail
                    );

                setNotifications(
                    Array.isArray(response)
                        ? response
                        : []
                );
            } catch (error) {
                console.error(
                    "Failed to load doctor notifications:",
                    error
                );

                const message =
                    getErrorMessage(error);

                if (!silent) {
                    setErrorMessage(message);
                    toast.error(message);
                }
            } finally {
                if (!silent) {
                    setLoading(false);
                }

                setRefreshing(false);
            }
        },
        [doctorEmail]
    );

    useEffect(() => {
        loadNotifications();

        const pollingInterval = setInterval(() => {
            loadNotifications({
                silent: true,
            });
        }, 3000);

        return () => {
            clearInterval(pollingInterval);
        };
    }, [loadNotifications]);

    const unreadCount = useMemo(
        () =>
            notifications.filter(
                (notification) =>
                    !notification.isRead
            ).length,
        [notifications]
    );

    const handleNotificationClick =
        async (notification) => {
            if (
                notification.isRead
            ) {
                return;
            }

            try {
                await markDoctorNotificationAsRead(
                    notification.id
                );

                setNotifications(
                    (
                        previousNotifications
                    ) =>
                        previousNotifications.map(
                            (item) =>
                                item.id ===
                                notification.id
                                    ? {
                                          ...item,
                                          isRead: true,
                                      }
                                    : item
                        )
                );
            } catch (error) {
                toast.error(
                    getErrorMessage(error)
                );
            }
        };

    const handleMarkAllRead =
        async () => {
            if (
                !doctorEmail ||
                unreadCount === 0
            ) {
                return;
            }

            try {
                setMarkingAll(true);

                await markAllDoctorNotificationsAsRead(
                    doctorEmail
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

                toast.success(
                    "All notifications marked as read."
                );
            } catch (error) {
                toast.error(
                    getErrorMessage(error)
                );
            } finally {
                setMarkingAll(false);
            }
        };

    if (
        doctorLoading ||
        loading
    ) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center">
                <LoaderCircle className="h-11 w-11 animate-spin text-blue-600" />

                <p className="mt-4 font-medium text-slate-500">
                    Loading doctor notifications...
                </p>
            </div>
        );
    }

    if (
        doctorError ||
        errorMessage
    ) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="max-w-lg rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
                    <CircleX className="mx-auto h-12 w-12 text-red-500" />

                    <h2 className="mt-4 text-xl font-bold text-slate-900">
                        Notifications could not be loaded
                    </h2>

                    <p className="mt-2 text-sm text-slate-600">
                        {doctorError ||
                            errorMessage}
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            reloadDoctor();
                            loadNotifications();
                        }}
                        className="mt-6 cursor-pointer rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-7 text-white shadow-lg shadow-blue-100 lg:p-9">
                <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10" />

                <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                    <div>
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                            <Bell size={25} />
                        </div>

                        <p className="text-sm font-semibold text-blue-100">
                            Doctor Notifications
                        </p>

                        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
                            Appointment Activity
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50">
                            Stay updated when patients book or cancel appointments.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-blue-900/35 px-6 py-5 backdrop-blur">
                        <p className="text-sm text-blue-100">
                            Unread notifications
                        </p>

                        <p className="mt-1 text-4xl font-bold">
                            {unreadCount}
                        </p>
                    </div>
                </div>
            </section>

            <section className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        All Notifications
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {notifications.length} total notifications
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() =>
                            loadNotifications({
                                showRefreshLoader: true,
                            })
                        }
                        disabled={refreshing}
                        className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw
                            size={17}
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>

                    <button
                        type="button"
                        onClick={
                            handleMarkAllRead
                        }
                        disabled={
                            markingAll ||
                            unreadCount === 0
                        }
                        className="flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {markingAll ? (
                            <LoaderCircle
                                size={17}
                                className="animate-spin"
                            />
                        ) : (
                            <CheckCheck
                                size={17}
                            />
                        )}

                        Mark All Read
                    </button>
                </div>
            </section>

            {notifications.length === 0 ? (
                <section className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <CalendarClock
                            size={30}
                        />
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-slate-900">
                        No notifications yet
                    </h2>

                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                        New appointment requests and patient cancellations will appear here.
                    </p>
                </section>
            ) : (
                <section className="space-y-4">
                    {notifications.map(
                        (notification) => {
                            const style =
                                getNotificationStyle(
                                    notification.type
                                );

                            return (
                                <button
                                    type="button"
                                    key={
                                        notification.id
                                    }
                                    onClick={() =>
                                        handleNotificationClick(
                                            notification
                                        )
                                    }
                                    className={`flex w-full cursor-pointer items-start gap-4 rounded-2xl border p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${style.container} ${
                                        notification.isRead
                                            ? "opacity-80"
                                            : ""
                                    }`}
                                >
                                    <div
                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${style.iconContainer}`}
                                    >
                                        {style.icon}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                                            <h3 className="font-bold text-slate-900">
                                                {
                                                    notification.title
                                                }
                                            </h3>

                                            {!notification.isRead && (
                                                <span className="w-fit rounded-full bg-blue-600 px-2.5 py-1 text-xs font-bold text-white">
                                                    New
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-2 leading-6 text-slate-600">
                                            {
                                                notification.message
                                            }
                                        </p>

                                        <p className="mt-3 text-xs font-medium text-slate-400">
                                            {formatNotificationDate(
                                                notification.createdAt
                                            )}
                                        </p>
                                    </div>
                                </button>
                            );
                        }
                    )}
                </section>
            )}
        </div>
    );
};

const DoctorNotifications = () => {
    return (
        <DoctorLayout>
            {({
                doctor,
                doctorLoading,
                doctorError,
                reloadDoctor,
            }) => (
                <DoctorNotificationsContent
                    doctor={doctor}
                    doctorLoading={
                        doctorLoading
                    }
                    doctorError={
                        doctorError
                    }
                    reloadDoctor={
                        reloadDoctor
                    }
                />
            )}
        </DoctorLayout>
    );
};

export default DoctorNotifications;