import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaCalendarCheck,
    FaCheckCircle,
    FaClock,
    FaStethoscope,
    FaCalendarPlus,
    FaTimesCircle
} from "react-icons/fa";

import PatientLayout from "../../components/patient/PatientLayout";
import api from "../../services/api";

const PatientDashboard = () => {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const [appointments, setAppointments] = useState([]);

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
                    "Failed to fetch patient appointments:",
                    error
                );

            }

        };

        fetchAppointments();

    }, [user.email]);

    const totalAppointments = appointments.length;

    const pendingAppointments = appointments.filter(
        (appointment) => appointment.status === "Pending"
    ).length;

    const completedAppointments = appointments.filter(
        (appointment) => appointment.status === "Completed"
    ).length;

    const cancelledAppointments = appointments.filter(
        (appointment) => appointment.status === "Cancelled"
    ).length;

    const upcomingAppointment = [...appointments]
        .filter(
            (appointment) =>
                appointment.status === "Pending"
        )
        .sort(
            (a, b) =>
                new Date(a.appointmentDate) -
                new Date(b.appointmentDate)
        )[0];

    return (

        <PatientLayout>

            <div className="space-y-6">

                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl p-8 shadow-lg">

                    <h1 className="text-3xl font-bold">

                        Welcome back, {user.fullName || "Patient"} 👋

                    </h1>

                    <p className="mt-2 text-blue-100">

                        Manage your appointments and health journey from one place.

                    </p>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

                    <div className="bg-white rounded-xl shadow p-5 border-l-4 border-blue-500">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm text-gray-500">
                                    Total Appointments
                                </p>

                                <h2 className="text-3xl font-bold text-blue-600 mt-2">
                                    {totalAppointments}
                                </h2>

                            </div>

                            <FaCalendarCheck className="text-3xl text-blue-500" />

                        </div>

                    </div>

                    <div className="bg-white rounded-xl shadow p-5 border-l-4 border-yellow-500">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm text-gray-500">
                                    Pending
                                </p>

                                <h2 className="text-3xl font-bold text-yellow-600 mt-2">
                                    {pendingAppointments}
                                </h2>

                            </div>

                            <FaClock className="text-3xl text-yellow-500" />

                        </div>

                    </div>

                    <div className="bg-white rounded-xl shadow p-5 border-l-4 border-green-500">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm text-gray-500">
                                    Completed
                                </p>

                                <h2 className="text-3xl font-bold text-green-600 mt-2">
                                    {completedAppointments}
                                </h2>

                            </div>

                            <FaCheckCircle className="text-3xl text-green-500" />

                        </div>

                    </div>

                    <div className="bg-white rounded-xl shadow p-5 border-l-4 border-red-500">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm text-gray-500">

                                    Cancelled

                                </p>

                                <h2 className="text-3xl font-bold text-red-600 mt-2">

                                    {cancelledAppointments}

                                </h2>

                            </div>

                            <FaTimesCircle className="text-3xl text-red-500" />

                        </div>

                    </div>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    <div className="bg-white rounded-2xl shadow p-6">

                        <h2 className="text-2xl font-semibold text-gray-800 mb-5">

                            Upcoming Appointment

                        </h2>

                        {upcomingAppointment ? (

                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">

                                <p className="text-sm text-gray-500">
                                    Doctor
                                </p>

                                <h3 className="text-xl font-bold text-blue-700 mt-1">

                                    Dr. {upcomingAppointment.doctorName}

                                </h3>

                                <div className="grid grid-cols-2 gap-4 mt-5">

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Problem
                                        </p>

                                        <p className="font-semibold text-gray-800">
                                            {upcomingAppointment.problem}
                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Status
                                        </p>

                                        <span className="inline-block mt-1 px-3 py-1 rounded-full bg-yellow-500 text-white text-sm">

                                            {upcomingAppointment.status}

                                        </span>

                                    </div>

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Date
                                        </p>

                                        <p className="font-semibold text-gray-800">
                                            {upcomingAppointment.appointmentDate}
                                        </p>

                                    </div>

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Time
                                        </p>

                                        <p className="font-semibold text-gray-800">
                                            {upcomingAppointment.appointmentTime}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        ) : (

                            <div className="text-center py-10 bg-gray-50 rounded-xl">

                                <p className="text-4xl">📅</p>

                                <p className="text-gray-500 mt-3">

                                    No upcoming appointments.

                                </p>

                            </div>

                        )}

                    </div>

                    <div className="bg-white rounded-2xl shadow p-6">

                        <h2 className="text-2xl font-semibold text-gray-800 mb-5">

                            Quick Actions

                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                            <button
                                type="button"
                                onClick={() => navigate("/appointment")}
                                className="bg-purple-50 hover:bg-purple-100 rounded-xl p-5 transition text-left cursor-pointer"
                            >

                                <FaCalendarPlus className="text-3xl text-purple-600" />

                                <p className="font-semibold text-gray-800 mt-4">

                                    Book Appointment

                                </p>

                                <p className="text-sm text-gray-500 mt-1">

                                    Schedule a new consultation.

                                </p>

                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/patient/appointments")
                                }
                                className="bg-blue-50 hover:bg-blue-100 rounded-xl p-5 transition text-left cursor-pointer"
                            >

                                <FaCalendarCheck className="text-3xl text-blue-600" />

                                <p className="font-semibold text-gray-800 mt-4">

                                    My Appointments

                                </p>

                                <p className="text-sm text-gray-500 mt-1">

                                    View your appointment history.

                                </p>

                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/patient/disease-analysis")
                                }
                                className="bg-green-50 hover:bg-green-100 rounded-xl p-5 transition text-left cursor-pointer"
                            >

                                <FaStethoscope className="text-3xl text-green-600" />

                                <p className="font-semibold text-gray-800 mt-4">

                                    Disease Analysis

                                </p>

                                <p className="text-sm text-gray-500 mt-1">

                                    Check symptoms and receive guidance.

                                </p>

                            </button>

                        </div>

                    </div>

                </div>

                <div className="bg-white rounded-2xl shadow p-6">

                    <h2 className="text-2xl font-semibold text-gray-800">

                        Health Tip of the Day

                    </h2>

                    <div className="mt-4 bg-green-50 border-l-4 border-green-500 rounded-lg p-5">

                        <p className="text-gray-700">

                            Drink enough water, sleep for 7–8 hours, and avoid ignoring recurring symptoms.

                        </p>

                    </div>

                </div>

            </div>

        </PatientLayout>

    );

};

export default PatientDashboard;