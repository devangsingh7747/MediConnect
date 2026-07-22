import { useMemo, useState } from "react";
import {
    Bell,
    LoaderCircle,
} from "lucide-react";
import { toast } from "react-toastify";

import { updateDoctorAvailability } from "../../services/doctorService";

const DoctorHeader = ({
    doctor,
    doctorLoading,
    onDoctorUpdate,
}) => {
    const [updatingAvailability, setUpdatingAvailability] =
        useState(false);

    const savedUser = useMemo(() => {
        try {
            return (
                JSON.parse(localStorage.getItem("user")) || null
            );
        } catch {
            return null;
        }
    }, []);

    const doctorEmail =
        doctor?.email || savedUser?.email || "";

    const fullName =
        `${doctor?.firstName || ""} ${
            doctor?.lastName || ""
        }`.trim() ||
        doctor?.name ||
        savedUser?.fullName ||
        "Doctor";

    const firstName =
        fullName.split(" ")[0] || "Doctor";

    const specialization =
        doctor?.specialization || "Profile incomplete";

    const isAvailable =
        doctor?.availability?.toUpperCase() === "AVAILABLE";

    const handleAvailabilityChange = async () => {
        if (
            !doctorEmail ||
            updatingAvailability ||
            doctorLoading
        ) {
            return;
        }

        const nextAvailability = isAvailable
            ? "UNAVAILABLE"
            : "AVAILABLE";

        if (
            nextAvailability === "AVAILABLE" &&
            !doctor?.specialization?.trim()
        ) {
            toast.warning(
                "Please complete your specialization before becoming available."
            );
            return;
        }

        try {
            setUpdatingAvailability(true);

            const updatedDoctor =
                await updateDoctorAvailability(
                    doctorEmail,
                    nextAvailability
                );

            /*
             * This updates the doctor state stored in DoctorLayout.
             * Every page using that shared state updates instantly.
             */
            onDoctorUpdate?.(updatedDoctor);

            if (nextAvailability === "AVAILABLE") {
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
                error?.response?.data?.message ||
                    error?.response?.data ||
                    "Unable to update availability."
            );
        } finally {
            setUpdatingAvailability(false);
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
                        onClick={handleAvailabilityChange}
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

                <button
                    type="button"
                    aria-label="Doctor notifications"
                    className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                >
                    <Bell size={20} />

                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                </button>

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