import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    CalendarCheck2,
    CalendarClock,
    CheckCircle2,
    CircleX,
    Clock3,
    Filter,
    LoaderCircle,
    Mail,
    RefreshCw,
    Stethoscope,
    UserRound,
} from "lucide-react";

import { toast } from "react-toastify";

import ConfirmModal from "../../components/common/ConfirmModal";
import DoctorLayout from "../../components/doctor/DoctorLayout";

import {
    acceptDoctorAppointment,
    completeDoctorAppointment,
    getDoctorAppointments,
    rejectDoctorAppointment,
} from "../../services/doctorService";

const statusPriority = {
    Pending: 1,
    Confirmed: 2,
    Completed: 3,
    Rejected: 4,
    Cancelled: 5,
};

const filters = [
    {
        label: "All",
        value: "All",
    },
    {
        label: "Pending Requests",
        value: "Pending",
    },
    {
        label: "Confirmed",
        value: "Confirmed",
    },
    {
        label: "Completed",
        value: "Completed",
    },
    {
        label: "Rejected",
        value: "Rejected",
    },
    {
        label: "Cancelled by Patient",
        value: "Cancelled",
    },
];

const statusStyles = {
    Pending: {
        badge: "bg-amber-100 text-amber-700",
        border: "border-amber-200",
        background:
            "bg-gradient-to-br from-white to-amber-50/60",
        icon: "bg-amber-100 text-amber-700",
    },

    Confirmed: {
        badge: "bg-blue-100 text-blue-700",
        border: "border-blue-200",
        background:
            "bg-gradient-to-br from-white to-blue-50/60",
        icon: "bg-blue-100 text-blue-700",
    },

    Completed: {
        badge: "bg-emerald-100 text-emerald-700",
        border: "border-emerald-200",
        background:
            "bg-gradient-to-br from-white to-emerald-50/60",
        icon: "bg-emerald-100 text-emerald-700",
    },

    Rejected: {
        badge: "bg-red-100 text-red-700",
        border: "border-red-200",
        background:
            "bg-gradient-to-br from-white to-red-50/60",
        icon: "bg-red-100 text-red-700",
    },

    Cancelled: {
        badge: "bg-slate-200 text-slate-700",
        border: "border-slate-300",
        background:
            "bg-gradient-to-br from-white to-slate-100/70",
        icon: "bg-slate-200 text-slate-700",
    },
};

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

const getErrorMessage = (error) => {
    const responseData = error?.response?.data;

    if (
        typeof responseData === "string" &&
        responseData.trim()
    ) {
        return responseData;
    }

    if (
        typeof responseData?.message === "string" &&
        responseData.message.trim()
    ) {
        return responseData.message;
    }

    if (
        typeof error?.message === "string" &&
        error.message.trim()
    ) {
        return error.message;
    }

    return "Unable to update the appointment.";
};

const formatDate = (dateValue) => {
    if (!dateValue) {
        return "Date not available";
    }

    const parsedDate = new Date(
        `${dateValue}T00:00:00`
    );

    if (Number.isNaN(parsedDate.getTime())) {
        return dateValue;
    }

    return parsedDate.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatTime = (timeValue) => {
    if (!timeValue) {
        return "Time not available";
    }

    const [hours = "0", minutes = "0"] =
        String(timeValue).split(":");

    const parsedTime = new Date();

    parsedTime.setHours(
        Number(hours),
        Number(minutes),
        0,
        0
    );

    if (Number.isNaN(parsedTime.getTime())) {
        return timeValue;
    }

    return parsedTime.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const DoctorAppointmentsContent = ({
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

    const [appointments, setAppointments] =
        useState([]);

    const [selectedFilter, setSelectedFilter] =
        useState("All");

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState("");

    const [actionLoading, setActionLoading] =
        useState({
            appointmentId: null,
            action: "",
        });

    const [confirmation, setConfirmation] =
        useState({
            isOpen: false,
            appointment: null,
            action: "",
        });

    const loadAppointments = useCallback(
        async (showRefreshLoader = false) => {
            if (!doctorEmail) {
                setErrorMessage(
                    "Doctor account information was not found."
                );

                setLoading(false);
                return;
            }

            try {
                if (showRefreshLoader) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setErrorMessage("");

                const response =
                    await getDoctorAppointments(
                        doctorEmail
                    );

                setAppointments(
                    Array.isArray(response)
                        ? response
                        : []
                );
            } catch (error) {
                console.error(
                    "Failed to load doctor appointments:",
                    error
                );

                const message =
                    getErrorMessage(error);

                setErrorMessage(message);
                toast.error(message);
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [doctorEmail]
    );

    useEffect(() => {
        loadAppointments();
    }, [loadAppointments]);

    const updateAppointmentInState = (
        updatedAppointment
    ) => {
        setAppointments(
            (previousAppointments) =>
                previousAppointments.map(
                    (appointment) =>
                        appointment.id ===
                        updatedAppointment.id
                            ? updatedAppointment
                            : appointment
                )
        );
    };

    const handleAccept = async (
        appointment
    ) => {
        try {
            setActionLoading({
                appointmentId: appointment.id,
                action: "accept",
            });

            const updatedAppointment =
                await acceptDoctorAppointment(
                    appointment.id
                );

            updateAppointmentInState(
                updatedAppointment
            );

            toast.success(
                "Appointment accepted successfully."
            );
        } catch (error) {
            console.error(
                "Failed to accept appointment:",
                error
            );

            toast.error(
                getErrorMessage(error)
            );
        } finally {
            setActionLoading({
                appointmentId: null,
                action: "",
            });
        }
    };

    const openConfirmation = (
        appointment,
        action
    ) => {
        setConfirmation({
            isOpen: true,
            appointment,
            action,
        });
    };

    const closeConfirmation = () => {
        if (actionLoading.appointmentId) {
            return;
        }

        setConfirmation({
            isOpen: false,
            appointment: null,
            action: "",
        });
    };

    const handleConfirmedAction =
        async () => {
            const appointment =
                confirmation.appointment;

            const action =
                confirmation.action;

            if (!appointment || !action) {
                return;
            }

            try {
                setActionLoading({
                    appointmentId:
                        appointment.id,
                    action,
                });

                let updatedAppointment;

                if (action === "reject") {
                    updatedAppointment =
                        await rejectDoctorAppointment(
                            appointment.id
                        );
                } else if (
                    action === "complete"
                ) {
                    updatedAppointment =
                        await completeDoctorAppointment(
                            appointment.id
                        );
                }

                if (updatedAppointment) {
                    updateAppointmentInState(
                        updatedAppointment
                    );
                }

                setConfirmation({
                    isOpen: false,
                    appointment: null,
                    action: "",
                });

                if (action === "reject") {
                    toast.success(
                        "Appointment rejected successfully."
                    );
                } else {
                    toast.success(
                        "Appointment marked as completed."
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to update appointment:",
                    error
                );

                toast.error(
                    getErrorMessage(error)
                );
            } finally {
                setActionLoading({
                    appointmentId: null,
                    action: "",
                });
            }
        };

    const appointmentCounts =
        useMemo(() => {
            return appointments.reduce(
                (counts, appointment) => {
                    const status =
                        appointment?.status ||
                        "Pending";

                    if (
                        Object.prototype.hasOwnProperty.call(
                            counts,
                            status
                        )
                    ) {
                        counts[status] += 1;
                    }

                    counts.All += 1;

                    return counts;
                },
                {
                    All: 0,
                    Pending: 0,
                    Confirmed: 0,
                    Completed: 0,
                    Rejected: 0,
                    Cancelled: 0,
                }
            );
        }, [appointments]);

    const visibleAppointments =
        useMemo(() => {
            return [...appointments]
                .filter((appointment) => {
                    if (
                        selectedFilter ===
                        "All"
                    ) {
                        return true;
                    }

                    return (
                        appointment.status ===
                        selectedFilter
                    );
                })
                .sort((first, second) => {
                    const firstPriority =
                        statusPriority[
                            first.status
                        ] || 99;

                    const secondPriority =
                        statusPriority[
                            second.status
                        ] || 99;

                    if (
                        firstPriority !==
                        secondPriority
                    ) {
                        return (
                            firstPriority -
                            secondPriority
                        );
                    }

                    const firstDateTime =
                        new Date(
                            `${first.appointmentDate}T${
                                first.appointmentTime ||
                                "00:00"
                            }`
                        );

                    const secondDateTime =
                        new Date(
                            `${second.appointmentDate}T${
                                second.appointmentTime ||
                                "00:00"
                            }`
                        );

                    return (
                        firstDateTime -
                        secondDateTime
                    );
                });
        }, [
            appointments,
            selectedFilter,
        ]);

    const modalConfiguration =
        useMemo(() => {
            const appointment =
                confirmation.appointment;

            if (
                confirmation.action ===
                "complete"
            ) {
                return {
                    title:
                        "Complete Appointment?",
                    message:
                        `Are you sure the consultation with ${
                            appointment?.patientName ||
                            "this patient"
                        } has been completed? This action will notify the patient.`,
                    confirmText:
                        "Mark Completed",
                    variant: "success",
                };
            }

            return {
                title:
                    "Reject Appointment?",
                message:
                    `Are you sure you want to reject the appointment for ${
                        appointment?.patientName ||
                        "this patient"
                    }? The patient will be notified.`,
                confirmText:
                    "Reject Appointment",
                variant: "danger",
            };
        }, [confirmation]);

    if (
        doctorLoading ||
        loading
    ) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center">
                <LoaderCircle className="h-11 w-11 animate-spin text-blue-600" />

                <p className="mt-4 font-medium text-slate-500">
                    Loading doctor appointments...
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
                        Appointments could not be loaded
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        {doctorError ||
                            errorMessage}
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            reloadDoctor();
                            loadAppointments();
                        }}
                        className="mt-6 cursor-pointer rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full space-y-6">
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-7 text-white shadow-lg shadow-blue-100 lg:p-9">
                    <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10" />

                    <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div>
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                                <CalendarCheck2
                                    size={25}
                                />
                            </div>

                            <p className="text-sm font-semibold text-blue-100">
                                Doctor Appointments
                            </p>

                            <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
                                Manage Consultations
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50 sm:text-base">
                                Review appointment
                                requests and manage
                                consultations assigned
                                to you.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-blue-900/35 px-6 py-5 backdrop-blur">
                            <p className="text-sm text-blue-100">
                                Total assigned
                                appointments
                            </p>

                            <p className="mt-1 text-4xl font-bold">
                                {
                                    appointmentCounts.All
                                }
                            </p>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    {[
                        {
                            title: "Pending",
                            count:
                                appointmentCounts.Pending,
                            style:
                                "border-amber-200 bg-amber-50 text-amber-800",
                        },
                        {
                            title: "Confirmed",
                            count:
                                appointmentCounts.Confirmed,
                            style:
                                "border-blue-200 bg-blue-50 text-blue-800",
                        },
                        {
                            title: "Completed",
                            count:
                                appointmentCounts.Completed,
                            style:
                                "border-emerald-200 bg-emerald-50 text-emerald-800",
                        },
                        {
                            title: "Rejected",
                            count:
                                appointmentCounts.Rejected,
                            style:
                                "border-red-200 bg-red-50 text-red-800",
                        },
                        {
                            title: "Cancelled",
                            count:
                                appointmentCounts.Cancelled,
                            style:
                                "border-slate-300 bg-slate-100 text-slate-800",
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className={`rounded-2xl border p-5 ${item.style}`}
                        >
                            <p className="text-sm font-semibold">
                                {item.title}
                            </p>

                            <p className="mt-2 text-3xl font-bold">
                                {item.count}
                            </p>
                        </div>
                    ))}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <Filter
                                    size={19}
                                />
                            </div>

                            <div>
                                <h2 className="font-bold text-slate-900">
                                    Filter
                                    Appointments
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Select a status
                                    to narrow the
                                    appointment list.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                loadAppointments(
                                    true
                                )
                            }
                            disabled={
                                refreshing
                            }
                            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
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
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                        {filters.map(
                            (filter) => (
                                <button
                                    type="button"
                                    key={
                                        filter.value
                                    }
                                    onClick={() =>
                                        setSelectedFilter(
                                            filter.value
                                        )
                                    }
                                    className={`cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                                        selectedFilter ===
                                        filter.value
                                            ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                                            : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                                    }`}
                                >
                                    {
                                        filter.label
                                    }

                                    <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                                        {
                                            appointmentCounts[
                                                filter
                                                    .value
                                            ]
                                        }
                                    </span>
                                </button>
                            )
                        )}
                    </div>
                </section>

                {visibleAppointments.length ===
                0 ? (
                    <section className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                        <CalendarClock className="h-14 w-14 text-slate-400" />

                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                            No appointments found
                        </h2>
                    </section>
                ) : (
                    <section className="grid gap-5 xl:grid-cols-2">
                        {visibleAppointments.map(
                            (
                                appointment
                            ) => {
                                const status =
                                    appointment.status ||
                                    "Pending";

                                const styles =
                                    statusStyles[
                                        status
                                    ] ||
                                    statusStyles.Pending;

                                const isCurrentAppointmentLoading =
                                    actionLoading.appointmentId ===
                                    appointment.id;

                                return (
                                    <article
                                        key={
                                            appointment.id
                                        }
                                        className={`rounded-3xl border p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${styles.border} ${styles.background}`}
                                    >
                                        <div className="flex justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div
                                                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.icon}`}
                                                >
                                                    <UserRound
                                                        size={
                                                            23
                                                        }
                                                    />
                                                </div>

                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                                        Patient
                                                    </p>

                                                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                                                        {appointment.patientName ||
                                                            "Patient"}
                                                    </h2>

                                                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                                                        <Mail
                                                            size={
                                                                15
                                                            }
                                                        />

                                                        {
                                                            appointment.patientEmail
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            <span
                                                className={`h-fit rounded-full px-3 py-1.5 text-xs font-bold ${styles.badge}`}
                                            >
                                                {
                                                    status
                                                }
                                            </span>
                                        </div>

                                        <div className="mt-6 rounded-2xl border border-slate-200 bg-white/80 p-4">
                                            <div className="flex gap-3">
                                                <Stethoscope className="text-blue-600" />

                                                <div>
                                                    <p className="text-xs uppercase text-slate-400">
                                                        Health
                                                        Problem
                                                    </p>

                                                    <p className="font-semibold text-slate-800">
                                                        {
                                                            appointment.problem
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                            <div className="flex items-center gap-3 rounded-xl bg-white/80 p-3">
                                                <CalendarCheck2 className="text-blue-600" />

                                                {formatDate(
                                                    appointment.appointmentDate
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3 rounded-xl bg-white/80 p-3">
                                                <Clock3 className="text-blue-600" />

                                                {formatTime(
                                                    appointment.appointmentTime
                                                )}
                                            </div>
                                        </div>

                                        {status ===
                                            "Pending" && (
                                            <div className="mt-6 grid gap-3 border-t border-slate-200 pt-5 sm:grid-cols-2">
                                                <button
                                                    type="button"
                                                    disabled={
                                                        isCurrentAppointmentLoading
                                                    }
                                                    onClick={() =>
                                                        handleAccept(
                                                            appointment
                                                        )
                                                    }
                                                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {isCurrentAppointmentLoading &&
                                                    actionLoading.action ===
                                                        "accept" ? (
                                                        <LoaderCircle className="animate-spin" />
                                                    ) : (
                                                        <CheckCircle2 />
                                                    )}

                                                    Accept
                                                </button>

                                                <button
                                                    type="button"
                                                    disabled={
                                                        isCurrentAppointmentLoading
                                                    }
                                                    onClick={() =>
                                                        openConfirmation(
                                                            appointment,
                                                            "reject"
                                                        )
                                                    }
                                                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    <CircleX />

                                                    Reject
                                                </button>
                                            </div>
                                        )}

                                        {status ===
                                            "Confirmed" && (
                                            <div className="mt-6 grid gap-3 border-t border-slate-200 pt-5 sm:grid-cols-2">
                                                <button
                                                    type="button"
                                                    disabled={
                                                        isCurrentAppointmentLoading
                                                    }
                                                    onClick={() =>
                                                        openConfirmation(
                                                            appointment,
                                                            "complete"
                                                        )
                                                    }
                                                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    <CheckCircle2 />

                                                    Mark
                                                    Completed
                                                </button>

                                                <button
                                                    type="button"
                                                    disabled={
                                                        isCurrentAppointmentLoading
                                                    }
                                                    onClick={() =>
                                                        openConfirmation(
                                                            appointment,
                                                            "reject"
                                                        )
                                                    }
                                                    className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-300 bg-white px-4 py-3 font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    <CircleX />

                                                    Reject /
                                                    Cancel
                                                </button>
                                            </div>
                                        )}

                                        {[
                                            "Completed",
                                            "Rejected",
                                            "Cancelled",
                                        ].includes(
                                            status
                                        ) && (
                                            <p className="mt-6 border-t border-slate-200 pt-5 text-center text-sm text-slate-500">
                                                This
                                                appointment
                                                is closed.
                                            </p>
                                        )}
                                    </article>
                                );
                            }
                        )}
                    </section>
                )}
            </div>

            <ConfirmModal
                isOpen={
                    confirmation.isOpen
                }
                title={
                    modalConfiguration.title
                }
                message={
                    modalConfiguration.message
                }
                confirmText={
                    modalConfiguration.confirmText
                }
                cancelText="Go Back"
                variant={
                    modalConfiguration.variant
                }
                loading={Boolean(
                    actionLoading.appointmentId
                )}
                onCancel={
                    closeConfirmation
                }
                onConfirm={
                    handleConfirmedAction
                }
            />
        </>
    );
};

const DoctorAppointments = () => {
    return (
        <DoctorLayout>
            {({
                doctor,
                doctorLoading,
                doctorError,
                reloadDoctor,
            }) => (
                <DoctorAppointmentsContent
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

export default DoctorAppointments;