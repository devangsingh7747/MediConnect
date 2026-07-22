import {
    Bell,
    UserRound,
} from "lucide-react";

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import NotificationDropdown from "../notifications/NotificationDropdown";

import {
    getNotificationCount,
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

const PatientHeader = () => {
    const user = useMemo(
        () => getSavedUser(),
        []
    );

    const [
        showNotifications,
        setShowNotifications,
    ] = useState(false);

    const [
        notificationCount,
        setNotificationCount,
    ] = useState(0);

    const notificationRef =
        useRef(null);

    const loadNotificationCount =
        useCallback(async () => {
            if (!user.email) {
                setNotificationCount(0);
                return;
            }

            try {
                const count =
                    await getNotificationCount(
                        user.email
                    );

                setNotificationCount(
                    Number(count) || 0
                );
            } catch (error) {
                console.error(
                    "Failed to load notification count:",
                    error
                );
            }
        }, [user.email]);

    useEffect(() => {
        loadNotificationCount();

        const interval =
            setInterval(
                loadNotificationCount,
                3000
            );

        return () => {
            clearInterval(interval);
        };
    }, [loadNotificationCount]);

    useEffect(() => {
        const handleClickOutside = (
            event
        ) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(
                    event.target
                )
            ) {
                setShowNotifications(
                    false
                );
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
            (previousValue) =>
                !previousValue
        );

        loadNotificationCount();
    };

    return (
        <header className="mb-6 flex items-center justify-between rounded-xl bg-white p-4 shadow">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">
                    Welcome,{" "}
                    {user.fullName ||
                        "Patient"}{" "}
                    👋
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Manage your health and
                    appointments from one place.
                </p>
            </div>

            <div className="flex items-center gap-4">
                <div
                    className="relative"
                    ref={notificationRef}
                >
                    <button
                        type="button"
                        onClick={
                            handleBellClick
                        }
                        className="relative cursor-pointer rounded-full p-2 transition hover:bg-gray-100"
                    >
                        <Bell size={22} />

                        {notificationCount >
                            0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
                                {notificationCount >
                                99
                                    ? "99+"
                                    : notificationCount}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 z-50 mt-3">
                            <NotificationDropdown
                                onUnreadCountChange={
                                    setNotificationCount
                                }
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <UserRound
                            size={21}
                        />
                    </div>

                    <div>
                        <p className="font-semibold text-gray-800">
                            {user.fullName ||
                                "Patient"}
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