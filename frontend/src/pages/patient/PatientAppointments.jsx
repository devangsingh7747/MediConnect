import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
    FaCalendarAlt,
    FaClock,
    FaTimesCircle
} from "react-icons/fa";

import PatientLayout from "../../components/patient/PatientLayout";
import ConfirmModal from "../../components/common/ConfirmModal";

import api from "../../services/api";

const PatientAppointments = () => {

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const [appointments, setAppointments] = useState([]);
    const [cancellingId, setCancellingId] = useState(null);

    const [showCancelModal, setShowCancelModal] = useState(false);

    const [
        selectedAppointmentId,
        setSelectedAppointmentId
    ] = useState(null);

    const [searchParams] = useSearchParams();

    const requestedStatus =
        searchParams.get("status") || "All";

    const [statusFilter, setStatusFilter] = useState(
        requestedStatus
    );

    useEffect(() => {

        const fetchAppointments = async () => {

            try {

                const response = await api.get("/appointments");

                const patientAppointments = response.data.filter(
                    (appointment) =>
                        appointment.patientEmail === user.email
                );

                setAppointments(patientAppointments);

            } catch (error) {

                console.error(
                    "Failed to fetch appointments:",
                    error
                );

                toast.error("Unable to load appointments.");

            }

        };

        fetchAppointments();

    }, [user.email]);

    const handleCancelAppointment = (appointmentId) => {

        setSelectedAppointmentId(appointmentId);

        setShowCancelModal(true);

    };

    const closeCancelModal = () => {

        if (cancellingId !== null) {

            return;

        }

        setShowCancelModal(false);

        setSelectedAppointmentId(null);

    };

    const confirmCancelAppointment = async () => {

        if (!selectedAppointmentId) {

            return;

        }

        try {

            setCancellingId(selectedAppointmentId);

            await api.put(
                `/appointments/${selectedAppointmentId}/status`,
                {
                    status: "Cancelled"
                }
            );

            setAppointments((previousAppointments) =>
                previousAppointments.map((appointment) =>

                    appointment.id === selectedAppointmentId
                        ? {
                            ...appointment,
                            status: "Cancelled"
                        }
                        : appointment

                )
            );

            toast.success(
                "Appointment cancelled successfully."
            );

            setShowCancelModal(false);

            setSelectedAppointmentId(null);

        } catch (error) {

            console.error(
                "Failed to cancel appointment:",
                error
            );

            let message =
                "Unable to cancel the appointment.";

            if (
                typeof error.response?.data === "string" &&
                error.response.data.trim() !== ""
            ) {

                message = error.response.data;

            } else if (error.response?.data?.message) {

                message = error.response.data.message;

            }

            toast.error(message);

        } finally {

            setCancellingId(null);

        }

    };

    const statusPriority = {

        Pending: 1,
        Confirmed: 2,
        Completed: 3,
        Cancelled: 4,
        Rejected: 5

    };

    const filteredAppointments = appointments
        .filter(
            (appointment) =>
                statusFilter === "All" ||
                appointment.status === statusFilter
        )
        .sort((firstAppointment, secondAppointment) => {

            const firstPriority =
                statusPriority[firstAppointment.status] || 4;

            const secondPriority =
                statusPriority[secondAppointment.status] || 4;

            if (firstPriority !== secondPriority) {

                return firstPriority - secondPriority;

            }

            const firstDateTime = new Date(
                `${firstAppointment.appointmentDate}T${firstAppointment.appointmentTime}`
            );

            const secondDateTime = new Date(
                `${secondAppointment.appointmentDate}T${secondAppointment.appointmentTime}`
            );

            return firstDateTime - secondDateTime;

        });

    return (

        <PatientLayout>

            <div className="space-y-6">

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">

                        My Appointments

                    </h1>

                    <p className="text-gray-500 mt-2">

                        View your upcoming and previous appointments.

                    </p>

                </div>

                <div className="bg-white rounded-xl shadow p-6">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                        <h2 className="text-xl font-semibold">

                            Appointment History

                        </h2>

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >

                            <option value="All">

                                All Status

                            </option>

                            <option value="Pending">

                                Pending

                            </option>

                            <option value="Confirmed">

                                Confirmed

                            </option>

                            <option value="Completed">

                                Completed

                            </option>

                            <option value="Cancelled">

                                Cancelled

                            </option>

                            <option value="Rejected">

                                Rejected

                            </option>

                        </select>

                    </div>

                    {filteredAppointments.length === 0 ? (

                        <div className="text-center py-12">

                            <p className="text-5xl">

                                📅

                            </p>

                            <p className="text-gray-500 mt-3">

                                No appointments found.

                            </p>

                        </div>

                    ) : (

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                            {filteredAppointments.map(
                                (appointment) => (

                                    <div
                                        key={appointment.id}
                                        className="
                                            bg-blue-50
                                            border
                                            border-blue-300
                                            rounded-xl
                                            p-5
                                            shadow-sm
                                            transition-all
                                            duration-300
                                            hover:bg-blue-100
                                            hover:border-blue-400
                                            hover:shadow-lg
                                            hover:-translate-y-1
                                        "
                                    >

                                        <div className="flex justify-between items-start gap-4">

                                            <div>

                                                <p className="text-sm text-gray-500">

                                                    Assigned Doctor

                                                </p>

                                                <h3 className="text-xl font-bold text-blue-600 mt-1">

                                                    Dr. {appointment.doctorName}

                                                </h3>

                                            </div>

                                            <span
                                                className={`px-3 py-1 rounded-full text-white text-sm ${
                                                    appointment.status === "Completed"
                                                        ? "bg-green-500"
                                                        : appointment.status === "Cancelled"
                                                        ? "bg-gray-500"
                                                        : appointment.status === "Rejected"
                                                        ? "bg-red-500"
                                                        : appointment.status === "Confirmed"
                                                        ? "bg-blue-600"
                                                        : "bg-yellow-500"
                                                }`}
                                            >

                                                {appointment.status}

                                            </span>

                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-5">

                                            <div>

                                                <p className="text-sm text-gray-500">

                                                    Problem

                                                </p>

                                                <span className="inline-block mt-1 px-3 py-1 bg-blue-200 text-blue-800 font-semibold text-sm rounded-full">

                                                    {appointment.problem}

                                                </span>

                                            </div>

                                            <div>

                                                <p className="text-sm text-gray-500">

                                                    Appointment ID

                                                </p>

                                                <p className="font-semibold text-gray-800">

                                                    #{appointment.id}

                                                </p>

                                            </div>

                                            <div>

                                                <p className="text-sm text-gray-500 flex items-center gap-2">

                                                    <FaCalendarAlt className="text-blue-500" />

                                                    Date

                                                </p>

                                                <p className="font-semibold text-gray-800 mt-1">

                                                    {appointment.appointmentDate}

                                                </p>

                                            </div>

                                            <div>

                                                <p className="text-sm text-gray-500 flex items-center gap-2">

                                                    <FaClock className="text-blue-500" />

                                                    Time

                                                </p>

                                                <p className="font-semibold text-gray-800 mt-1">

                                                    {appointment.appointmentTime}

                                                </p>

                                            </div>

                                        </div>

                                        {(
                                            appointment.status === "Pending" ||
                                            appointment.status === "Confirmed"
                                        ) && (

                                            <div className="mt-5 pt-4 border-t border-blue-200">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleCancelAppointment(
                                                            appointment.id
                                                        )
                                                    }
                                                    disabled={
                                                        cancellingId === appointment.id
                                                    }
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        justify-center
                                                        gap-2
                                                        bg-red-500
                                                        hover:bg-red-600
                                                        disabled:bg-red-300
                                                        text-white
                                                        font-semibold
                                                        px-4
                                                        py-2
                                                        rounded-lg
                                                        transition
                                                        cursor-pointer
                                                        disabled:cursor-not-allowed
                                                    "
                                                >

                                                    <FaTimesCircle />

                                                    {cancellingId === appointment.id
                                                        ? "Cancelling..."
                                                        : "Cancel Appointment"
                                                    }

                                                </button>

                                            </div>

                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>

            <ConfirmModal
                isOpen={showCancelModal}
                title="Cancel Appointment?"
                message="Are you sure you want to cancel this appointment? This action cannot be undone."
                confirmText={
                    cancellingId
                        ? "Cancelling..."
                        : "Yes, Cancel It"
                }
                cancelText="No, Keep It"
                onConfirm={confirmCancelAppointment}
                onCancel={closeCancelModal}
            />

        </PatientLayout>

    );

};

export default PatientAppointments;