import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useNavigate } from "react-router-dom";

import {
    CalendarCheck2,
    CalendarClock,
    CheckCircle2,
    CircleX,
    ClipboardCheck,
    Clock3,
    LoaderCircle,
    Stethoscope,
    UserRound,
} from "lucide-react";

import DoctorLayout from "../../components/doctor/DoctorLayout";
import { getDoctorAppointments } from "../../services/doctorService";

const getSavedUser = () => {
    try {
        return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
        return null;
    }
};

const formatDate = (dateValue) => {
    if (!dateValue) {
        return "Date not available";
    }

    const parsedDate = new Date(`${dateValue}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
        return dateValue;
    }

    return parsedDate.toLocaleDateString("en-IN", {
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

    const date = new Date();

    date.setHours(
        Number(hours),
        Number(minutes),
        0,
        0
    );

    if (Number.isNaN(date.getTime())) {
        return timeValue;
    }

    return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const DoctorDashboardContent = ({
    doctor,
    doctorLoading,
    doctorError,
    reloadDoctor,
}) => {
    const navigate = useNavigate();

    const savedUser = useMemo(() => getSavedUser(), []);
    const doctorEmail = savedUser?.email || "";

    const [appointments, setAppointments] = useState([]);
    const [appointmentsLoading, setAppointmentsLoading] =
        useState(true);
    const [appointmentsError, setAppointmentsError] =
        useState("");

    const loadAppointments = useCallback(async () => {
        if (!doctorEmail) {
            setAppointmentsError(
                "Doctor account information was not found."
            );
            setAppointmentsLoading(false);
            return;
        }

        try {
            setAppointmentsLoading(true);
            setAppointmentsError("");

            const appointmentData =
                await getDoctorAppointments(doctorEmail);

            setAppointments(
                Array.isArray(appointmentData)
                    ? appointmentData
                    : []
            );
        } catch (error) {
            console.error(
                "Failed to load doctor appointments:",
                error
            );

            setAppointmentsError(
                error?.response?.data?.message ||
                    error?.response?.data ||
                    "Unable to load doctor appointments."
            );
        } finally {
            setAppointmentsLoading(false);
        }
    }, [doctorEmail]);

    useEffect(() => {
        loadAppointments();
    }, [loadAppointments]);

    const appointmentCounts = useMemo(() => {
        return appointments.reduce(
            (counts, appointment) => {
                const status =
                    appointment?.status?.toLowerCase() || "";

                if (status === "pending") {
                    counts.pending += 1;
                } else if (status === "confirmed") {
                    counts.confirmed += 1;
                } else if (status === "completed") {
                    counts.completed += 1;
                } else if (
                    status === "rejected" ||
                    status === "cancelled"
                ) {
                    counts.rejectedOrCancelled += 1;
                }

                return counts;
            },
            {
                pending: 0,
                confirmed: 0,
                completed: 0,
                rejectedOrCancelled: 0,
            }
        );
    }, [appointments]);

    const nextAppointment = useMemo(() => {
        const activeAppointments = appointments
            .filter((appointment) => {
                const status =
                    appointment?.status?.toLowerCase();

                return (
                    status === "pending" ||
                    status === "confirmed"
                );
            })
            .map((appointment) => ({
                ...appointment,
                calculatedDateTime: new Date(
                    `${appointment.appointmentDate}T${
                        appointment.appointmentTime ||
                        "00:00"
                    }`
                ),
            }))
            .filter(
                (appointment) =>
                    !Number.isNaN(
                        appointment.calculatedDateTime.getTime()
                    )
            )
            .sort(
                (first, second) =>
                    first.calculatedDateTime -
                    second.calculatedDateTime
            );

        const futureAppointment =
            activeAppointments.find(
                (appointment) =>
                    appointment.calculatedDateTime >=
                    new Date()
            );

        return (
            futureAppointment ||
            activeAppointments[0] ||
            null
        );
    }, [appointments]);

    const fullName =
        `${doctor?.firstName || ""} ${
            doctor?.lastName || ""
        }`.trim() ||
        doctor?.name ||
        savedUser?.fullName ||
        "Doctor";

    const isAvailable =
        doctor?.availability?.toUpperCase() === "AVAILABLE";

    const profileCompleted = Boolean(
        doctor?.firstName?.trim() &&
            doctor?.lastName?.trim() &&
            doctor?.specialization?.trim() &&
            doctor?.phone?.trim() &&
            doctor?.hospital?.trim()
    );

    const statistics = [
        {
            title: "Pending Requests",
            value: appointmentCounts.pending,
            description: "Waiting for your response",
            icon: CalendarClock,
            cardStyle:
                "border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-100/60",
            iconContainer:
                "bg-amber-200 text-amber-700",
            valueStyle: "text-amber-800",
        },
        {
            title: "Confirmed",
            value: appointmentCounts.confirmed,
            description: "Upcoming consultations",
            icon: CalendarCheck2,
            cardStyle:
                "border-blue-200 bg-gradient-to-br from-blue-50 to-sky-100/60",
            iconContainer:
                "bg-blue-200 text-blue-700",
            valueStyle: "text-blue-800",
        },
        {
            title: "Completed",
            value: appointmentCounts.completed,
            description: "Finished consultations",
            icon: CheckCircle2,
            cardStyle:
                "border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-100/60",
            iconContainer:
                "bg-emerald-200 text-emerald-700",
            valueStyle: "text-emerald-800",
        },
        {
            title: "Rejected / Cancelled",
            value:
                appointmentCounts.rejectedOrCancelled,
            description: "Closed appointment requests",
            icon: CircleX,
            cardStyle:
                "border-red-200 bg-gradient-to-br from-red-50 to-rose-100/60",
            iconContainer:
                "bg-red-200 text-red-700",
            valueStyle: "text-red-800",
        },
    ];

    if (doctorLoading || appointmentsLoading) {
        return (
            <div className="flex min-h-[65vh] flex-col items-center justify-center">
                <LoaderCircle className="h-10 w-10 animate-spin text-blue-600" />

                <p className="mt-4 font-medium text-slate-500">
                    Loading your dashboard...
                </p>
            </div>
        );
    }

    if (doctorError || appointmentsError) {
        return (
            <div className="flex min-h-[65vh] items-center justify-center">
                <div className="max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
                    <CircleX className="mx-auto h-12 w-12 text-red-500" />

                    <h2 className="mt-4 text-xl font-bold text-slate-900">
                        Dashboard could not be loaded
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        {doctorError || appointmentsError}
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            reloadDoctor();
                            loadAppointments();
                        }}
                        className="mt-6 cursor-pointer rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-7">
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-7 text-white shadow-lg shadow-blue-100 lg:p-9">
                <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10" />
                <div className="absolute -bottom-24 right-24 h-56 w-56 rounded-full bg-white/10" />

                <div className="relative z-10 flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
                    <div>
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                            <Stethoscope size={25} />
                        </div>

                        <p className="text-sm font-semibold text-blue-100">
                            Doctor Dashboard
                        </p>

                        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
                            Welcome, Dr. {fullName}
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50 sm:text-base">
                            Manage your appointment requests,
                            consultations, availability and
                            professional profile from one place.
                        </p>
                    </div>

                    <div className="min-w-90 rounded-2xl border border-white/10 bg-blue-900/45 p-5 shadow-lg backdrop-blur-md">
                        <p className="text-md font-medium text-blue-100">
                            Current availability
                        </p>

                        <div className="mt-3 flex items-center gap-2">
                            <span
                                className={`h-3 w-3 rounded-full ${
                                    isAvailable
                                        ? "bg-emerald-400"
                                        : "bg-red-400"
                                }`}
                            />

                            <p
                                className={`text-2xl font-bold ${
                                    isAvailable
                                        ? "text-emerald-300"
                                        : "text-red-300"
                                }`}
                            >
                                {isAvailable
                                    ? "Available"
                                    : "Unavailable"}
                            </p>
                        </div>

                        <p className="mt-3 max-w-md text-sm leading-6 text-blue-50">
                            Update availability from the header
                            toggle after completing your
                            professional profile.
                        </p>
                    </div>
                </div>
            </section>

            {!profileCompleted && (
                <section className="flex flex-col justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center">
                    <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                            <UserRound size={21} />
                        </div>

                        <div>
                            <h2 className="font-bold text-slate-900">
                                Complete your doctor profile
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-slate-600">
                                Add your specialization,
                                experience, hospital and contact
                                information before accepting new
                                appointments.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/doctor/profile")
                        }
                        className="shrink-0 cursor-pointer rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
                    >
                        Complete Profile
                    </button>
                </section>
            )}

            <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {statistics.map((statistic) => {
                    const Icon = statistic.icon;

                    return (
                        <article
                            key={statistic.title}
                            className={`rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${statistic.cardStyle}`}
                        >
                            <div className="flex items-start justify-between">
                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${statistic.iconContainer}`}
                                >
                                    <Icon size={23} />
                                </div>

                                <span
                                    className={`text-3xl font-bold ${statistic.valueStyle}`}
                                >
                                    {statistic.value}
                                </span>
                            </div>

                            <h3 className="mt-5 font-bold text-slate-900">
                                {statistic.title}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                {statistic.description}
                            </p>
                        </article>
                    );
                })}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                Next Appointment
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Your nearest active consultation
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/doctor/appointments"
                                )
                            }
                            className="cursor-pointer text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                            View all appointments
                        </button>
                    </div>

                    {nextAppointment ? (
                        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                                        <UserRound size={23} />
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                                            Patient
                                        </p>

                                        <h3 className="mt-1 text-lg font-bold text-slate-900">
                                            {nextAppointment.patientName ||
                                                "Patient"}
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-600">
                                            {nextAppointment.problem ||
                                                "Medical consultation"}
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
                                        nextAppointment.status ===
                                        "Confirmed"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-amber-100 text-amber-700"
                                    }`}
                                >
                                    {nextAppointment.status}
                                </span>
                            </div>

                            <div className="mt-5 grid gap-3 border-t border-blue-100 pt-5 sm:grid-cols-2">
                                <div className="flex items-center gap-3 text-sm text-slate-700">
                                    <CalendarCheck2
                                        size={18}
                                        className="text-blue-600"
                                    />

                                    <span>
                                        {formatDate(
                                            nextAppointment.appointmentDate
                                        )}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 text-sm text-slate-700">
                                    <Clock3
                                        size={18}
                                        className="text-blue-600"
                                    />

                                    <span>
                                        {formatTime(
                                            nextAppointment.appointmentTime
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                <CalendarClock size={30} />
                            </div>

                            <h3 className="mt-4 font-bold text-slate-800">
                                No appointments assigned
                            </h3>

                            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                Your upcoming appointments will
                                appear here after patients are
                                assigned to you.
                            </p>
                        </div>
                    )}
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="border-b border-slate-100 pb-5">
                        <h2 className="text-xl font-bold text-slate-900">
                            Appointment Workflow
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            How doctor appointment actions work
                        </p>
                    </div>

                    <div className="mt-6 space-y-5">
                        {[
                            {
                                number: "01",
                                title: "Review Request",
                                description:
                                    "Check the patient's problem, appointment date and requested time.",
                                icon: CalendarClock,
                            },
                            {
                                number: "02",
                                title: "Accept or Reject",
                                description:
                                    "Confirm a valid request or reject it when consultation is unavailable.",
                                icon: ClipboardCheck,
                            },
                            {
                                number: "03",
                                title: "Complete Consultation",
                                description:
                                    "After attending a confirmed consultation, mark it as completed.",
                                icon: CheckCircle2,
                            },
                        ].map((workflow) => {
                            const Icon = workflow.icon;

                            return (
                                <div
                                    key={workflow.number}
                                    className="flex gap-4"
                                >
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <Icon size={20} />
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-blue-500">
                                                {workflow.number}
                                            </span>

                                            <h3 className="font-bold text-slate-900">
                                                {workflow.title}
                                            </h3>
                                        </div>

                                        <p className="mt-1 text-sm leading-6 text-slate-500">
                                            {
                                                workflow.description
                                            }
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </article>
            </section>
        </div>
    );
};

const DoctorDashboard = () => {
    return (
        <DoctorLayout>
            {({
                doctor,
                doctorLoading,
                doctorError,
                reloadDoctor,
            }) => (
                <DoctorDashboardContent
                    doctor={doctor}
                    doctorLoading={doctorLoading}
                    doctorError={doctorError}
                    reloadDoctor={reloadDoctor}
                />
            )}
        </DoctorLayout>
    );
};

export default DoctorDashboard;