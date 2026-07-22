import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    Bell,
    CheckCheck,
    LoaderCircle,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import { toast } from "react-toastify";

import {
    getDoctorUnreadNotificationCount,
    getLatestDoctorNotifications,
    markAllDoctorNotificationsAsRead,
    markDoctorNotificationAsRead,
    updateDoctorAvailability,
} from "../../services/doctorService";

const formatNotificationTime = (
    createdAt
) => {
    if (!createdAt) {
        return "";
    }

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
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

    return "Unable to complete the request.";
};

const DoctorHeader = ({
    doctor,
    doctorLoading,
    onDoctorUpdate,
}) => {
    const navigate = useNavigate();
    const notificationRef = useRef(null);

    const [
        updatingAvailability,
        setUpdatingAvailability,
    ] = useState(false);

    const [
        notificationOpen,
        setNotificationOpen,
    ] = useState(false);

    const [
        notifications,
        setNotifications,
    ] = useState([]);

    const [
        unreadCount,
        setUnreadCount,
    ] = useState(0);

    const [
        notificationLoading,
        setNotificationLoading,
    ] = useState(false);

    const [
        markingAll,
        setMarkingAll,
    ] = useState(false);

    const savedUser = useMemo(() => {
        try {
            return (
                JSON.parse(
                    localStorage.getItem(
                        "user"
                    )
                ) || null
            );
        } catch {
            return null;
        }
    }, []);

    const doctorEmail =
        doctor?.email ||
        savedUser?.email ||
        "";

    const fullName =
        `${doctor?.firstName || ""} ${
            doctor?.lastName || ""
        }`.trim() ||
        doctor?.name ||
        savedUser?.fullName ||
        "Doctor";

    const firstName =
        fullName.split(" ")[0] ||
        "Doctor";

    const specialization =
        doctor?.specialization ||
        "Profile incomplete";

    const isAvailable =
        doctor?.availability?.toUpperCase() ===
        "AVAILABLE";

    const loadNotificationSummary =
        useCallback(async () => {
            if (!doctorEmail) {
                return;
            }

            try {
                const [
                    latestNotifications,
                    countResponse,
                ] = await Promise.all([
                    getLatestDoctorNotifications(
                        doctorEmail
                    ),
                    getDoctorUnreadNotificationCount(
                        doctorEmail
                    ),
                ]);

                setNotifications(
                    Array.isArray(
                        latestNotifications
                    )
                        ? latestNotifications
                        : []
                );

                /*
                 * Supports either a plain number or
                 * an object such as { count: 2 }.
                 */
                const count =
                    typeof countResponse ===
                    "number"
                        ? countResponse
                        : countResponse?.count ??
                          countResponse
                              ?.unreadCount ??
                          0;

                setUnreadCount(
                    Number(count) || 0
                );
            } catch (error) {
                console.error(
                    "Failed to load doctor notification summary:",
                    error
                );
            }
        }, [doctorEmail]);

    useEffect(() => {
        loadNotificationSummary();

        const pollingInterval =
            setInterval(
                loadNotificationSummary,
                3000
            );

        return () => {
            clearInterval(
                pollingInterval
            );
        };
    }, [loadNotificationSummary]);

    useEffect(() => {
        const handleOutsideClick = (
            event
        ) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(
                    event.target
                )
            ) {
                setNotificationOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, []);

    const handleAvailabilityChange =
        async () => {
            if (
                !doctorEmail ||
                updatingAvailability ||
                doctorLoading
            ) {
                return;
            }

            const nextAvailability =
                isAvailable
                    ? "UNAVAILABLE"
                    : "AVAILABLE";

            if (
                nextAvailability ===
                    "AVAILABLE" &&
                !doctor?.specialization?.trim()
            ) {
                toast.warning(
                    "Please complete your specialization before becoming available."
                );

                return;
            }

            try {
                setUpdatingAvailability(
                    true
                );

                const updatedDoctor =
                    await updateDoctorAvailability(
                        doctorEmail,
                        nextAvailability
                    );

                onDoctorUpdate?.(
                    updatedDoctor
                );

                if (
                    nextAvailability ===
                    "AVAILABLE"
                ) {
                    toast.success(
                        "You are now available for appointments."
                    );
                } else {
                    toast.error(
                        "You are now unavailable for appointments."
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to update doctor availability:",
                    error
                );

                toast.error(
                    getErrorMessage(error)
                );
            } finally {
                setUpdatingAvailability(
                    false
                );
            }
        };

    const handleBellClick = async () => {
        const nextOpen =
            !notificationOpen;

        setNotificationOpen(nextOpen);

        if (nextOpen) {
            try {
                setNotificationLoading(
                    true
                );

                await loadNotificationSummary();
            } finally {
                setNotificationLoading(
                    false
                );
            }
        }
    };

    const handleNotificationClick =
        async (notification) => {
            try {
                if (
                    !notification.isRead
                ) {
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

                    setUnreadCount(
                        (previousCount) =>
                            Math.max(
                                0,
                                previousCount -
                                    1
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

                setUnreadCount(0);

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

    return (
        <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur lg:px-8">
            <div>
                <p className="text-sm font-medium text-slate-500">
                    Welcome back,
                </p>

                <h2 className="text-xl font-bold text-slate-900">
                    Dr. {firstName}
                </h2>
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
                <div className="hidden items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 sm:flex">
                    <div>
                        <p className="text-xs font-semibold text-slate-500">
                            Availability
                        </p>

                        <p
                            className={`text-xs font-bold ${
                                isAvailable
                                    ? "text-emerald-600"
                                    : "text-red-600"
                            }`}
                        >
                            {isAvailable
                                ? "Available"
                                : "Unavailable"}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={
                            handleAvailabilityChange
                        }
                        disabled={
                            doctorLoading ||
                            updatingAvailability
                        }
                        aria-label="Change doctor availability"
                        className={`relative h-7 w-12 cursor-pointer rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                            isAvailable
                                ? "bg-emerald-500"
                                : "bg-slate-300"
                        }`}
                    >
                        <span
                            className={`absolute top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm transition-transform ${
                                isAvailable
                                    ? "translate-x-6"
                                    : "translate-x-1"
                            }`}
                        >
                            {updatingAvailability && (
                                <LoaderCircle
                                    size={12}
                                    className="animate-spin text-slate-500"
                                />
                            )}
                        </span>
                    </button>
                </div>

                <div
                    ref={notificationRef}
                    className="relative"
                >
                    <button
                        type="button"
                        onClick={
                            handleBellClick
                        }
                        aria-label="Doctor notifications"
                        className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                    >
                        <Bell size={20} />

                        {unreadCount > 0 && (
                            <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                {unreadCount > 99
                                    ? "99+"
                                    : unreadCount}
                            </span>
                        )}
                    </button>

                    {notificationOpen && (
                        <div className="absolute right-0 top-14 z-50 w-[380px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                            <div className="flex items-center justify-between border-b border-slate-100 p-4">
                                <div>
                                    <h3 className="font-bold text-slate-900">
                                        Notifications
                                    </h3>

                                    <p className="text-xs text-slate-500">
                                        {unreadCount} unread
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        handleMarkAllRead
                                    }
                                    disabled={
                                        markingAll ||
                                        unreadCount ===
                                            0
                                    }
                                    className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {markingAll ? (
                                        <LoaderCircle
                                            size={15}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <CheckCheck
                                            size={15}
                                        />
                                    )}

                                    Mark all read
                                </button>
                            </div>

                            <div className="max-h-96 overflow-y-auto">
                                {notificationLoading ? (
                                    <div className="flex flex-col items-center justify-center p-10">
                                        <LoaderCircle className="h-7 w-7 animate-spin text-blue-600" />

                                        <p className="mt-3 text-sm text-slate-500">
                                            Loading notifications...
                                        </p>
                                    </div>
                                ) : notifications.length ===
                                  0 ? (
                                    <div className="p-10 text-center">
                                        <Bell className="mx-auto h-9 w-9 text-slate-300" />

                                        <p className="mt-3 font-semibold text-slate-700">
                                            No notifications
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            New appointment activity will appear here.
                                        </p>
                                    </div>
                                ) : (
                                    notifications.map(
                                        (
                                            notification
                                        ) => (
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
                                                className={`block w-full cursor-pointer border-b border-slate-100 p-4 text-left transition hover:bg-blue-50 ${
                                                    notification.isRead
                                                        ? "bg-white"
                                                        : "bg-blue-50/70"
                                                }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <span
                                                        className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${
                                                            notification.isRead
                                                                ? "bg-slate-300"
                                                                : "bg-blue-600"
                                                        }`}
                                                    />

                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-slate-900">
                                                            {
                                                                notification.title
                                                            }
                                                        </p>

                                                        <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">
                                                            {
                                                                notification.message
                                                            }
                                                        </p>

                                                        <p className="mt-2 text-xs text-slate-400">
                                                            {formatNotificationTime(
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

                            <button
                                type="button"
                                onClick={() => {
                                    setNotificationOpen(
                                        false
                                    );

                                    navigate(
                                        "/doctor/notifications"
                                    );
                                }}
                                className="w-full cursor-pointer border-t border-slate-100 bg-slate-50 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                            >
                                View all notifications
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden text-right md:block">
                        <p className="max-w-44 truncate text-sm font-bold text-slate-800">
                            Dr. {fullName}
                        </p>

                        <p className="max-w-44 truncate text-xs font-medium text-slate-500">
                            {specialization}
                        </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-sm font-bold uppercase text-white shadow-md">
                        {fullName.charAt(0)}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DoctorHeader;