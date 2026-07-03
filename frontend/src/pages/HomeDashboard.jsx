import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PatientsChart from "../components/dashboard/PatientsChart";
import AppointmentPieChart from "../components/dashboard/AppointmentPieChart";

import {
    FaUserInjured,
    FaUserMd,
    FaCalendarCheck,
    FaClipboardList
} from "react-icons/fa";

import api from "../services/api";
import Layout from "../components/layout/Layout";
import StatsCard from "../components/dashboard/StatsCard";

const HomeDashboard = () => {

    const [patientCount, setPatientCount] = useState(0);
    const [doctorCount, setDoctorCount] = useState(0);
    const [appointmentCount, setAppointmentCount] = useState(0);

    const [recentPatients, setRecentPatients] = useState([]);
    const [recentDoctors, setRecentDoctors] = useState([]);
    const [recentAppointments, setRecentAppointments] = useState([]);

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const fetchDashboardData = async () => {

        try {

            const response = await api.get("/dashboard");

            setPatientCount(response.data.patientCount);
            setDoctorCount(response.data.doctorCount);
            setAppointmentCount(response.data.appointmentCount);

            setRecentPatients(response.data.recentPatients);
            setRecentDoctors(response.data.recentDoctors);
            setRecentAppointments(response.data.recentAppointments);

        } catch (error) {

            console.error("Failed to load dashboard:", error);

        }

    };

    useEffect(() => {

        fetchDashboardData();

    }, []);

    const hour = new Date().getHours();

    let greeting = "Good Evening";

    if (hour < 12) {

        greeting = "Good Morning";

    } else if (hour < 18) {

        greeting = "Good Afternoon";

    }

    return (

        <Layout>

            <div className="p-8">

                <h1 className="text-4xl font-bold text-gray-800">

                    {greeting}, {user?.fullName} 👋

                </h1>

                <p className="text-gray-500 mt-2 mb-8">

                    Manage patients, doctors and appointments from one dashboard.

                </p>

                {/* Stats Cards */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    <StatsCard
                        title="Patients"
                        value={patientCount}
                        color="text-blue-600"
                        icon={<FaUserInjured className="text-blue-600" />}
                        onClick={() => navigate("/dashboard")}
                    />

                    <StatsCard
                        title="Doctors"
                        value={doctorCount}
                        color="text-green-600"
                        icon={<FaUserMd className="text-green-600" />}
                        onClick={() => navigate("/doctor-dashboard")}
                    />

                    <StatsCard
                        title="Appointments"
                        value={appointmentCount}
                        color="text-purple-600"
                        icon={<FaCalendarCheck className="text-purple-600" />}
                        onClick={() => navigate("/appointment-dashboard")}
                    />

                    <StatsCard
                        title="Today's Appointments"
                        value={appointmentCount}
                        color="text-orange-600"
                        icon={<FaClipboardList className="text-orange-600" />}
                        onClick={() => navigate("/appointment-dashboard")}
                    />

                </div>

                {/* Bottom Section */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">

                    {/* Quick Actions */}

                    <div className="bg-white rounded-2xl shadow-md p-6">

                        <h2 className="text-2xl font-semibold mb-6">

                            Quick Actions

                        </h2>

                        <div className="grid grid-cols-2 gap-4">

                            <button
                                onClick={() => navigate("/dashboard")}
                                className="
                                    bg-blue-50
                                    hover:bg-blue-100
                                    hover:shadow-lg
                                    hover:-translate-y-1
                                    cursor-pointer
                                    rounded-xl
                                    p-5
                                    transition-all
                                    duration-300
                                "
                            >

                                <div className="flex justify-center mb-4">

                                    <FaUserInjured className="text-4xl text-blue-600" />

                                </div>

                                <p className="text-center font-semibold">

                                    Patients

                                </p>

                            </button>

                            <button
                                onClick={() => navigate("/doctor-dashboard")}
                                className="
                                    bg-green-50
                                    hover:bg-green-100
                                    hover:shadow-lg
                                    hover:-translate-y-1
                                    cursor-pointer
                                    rounded-xl
                                    p-5
                                    transition-all
                                    duration-300
                                "
                            >

                                <div className="flex justify-center mb-4">

                                    <FaUserMd className="text-4xl text-green-600" />

                                </div>

                                <p className="text-center font-semibold">

                                    Doctors

                                </p>

                            </button>

                            <button
                                onClick={() => navigate("/appointment-dashboard")}
                                className="
                                    bg-purple-50
                                    hover:bg-purple-100
                                    hover:shadow-lg
                                    hover:-translate-y-1
                                    cursor-pointer
                                    rounded-xl
                                    p-5
                                    transition-all
                                    duration-300
                                "
                            >

                                <div className="flex justify-center mb-4">

                                    <FaCalendarCheck className="text-4xl text-purple-600" />

                                </div>

                                <p className="text-center font-semibold">

                                    Appointments

                                </p>

                            </button>

                            <button
                                onClick={() => alert("Reports module is under development 🚀")}
                                className="
                                    bg-orange-50
                                    hover:bg-orange-100
                                    hover:shadow-lg
                                    hover:-translate-y-1
                                    cursor-pointer
                                    rounded-xl
                                    p-5
                                    transition-all
                                    duration-300
                                "
                            >

                                <div className="flex justify-center mb-4">

                                    <FaClipboardList className="text-4xl text-orange-600" />

                                </div>

                                <p className="text-center font-semibold">

                                    Reports

                                </p>

                            </button>

                        </div>

                    </div>

                    {/* Recent Activity */}

                    <div className="bg-white rounded-2xl shadow-md p-6">

                        <h2 className="text-2xl font-semibold mb-6">

                            Recent Activity

                        </h2>

                        <div className="space-y-5">

                            {/* Recent Patients */}

                            {recentPatients.map((patient) => (

                                <div
                                    key={`patient-${patient.id}`}
                                    className="border-l-4 border-blue-500 pl-4"
                                >

                                    <p className="font-medium">

                                        👤 New Patient:{" "}

                                        <span className="font-bold">

                                            {patient.firstName} {patient.lastName}

                                        </span>

                                    </p>

                                    <span className="text-sm text-gray-500">

                                        {patient.email}

                                    </span>

                                </div>

                            ))}

                            {/* Recent Doctors */}

                            {recentDoctors.map((doctor) => (

                                <div
                                    key={`doctor-${doctor.id}`}
                                    className="border-l-4 border-green-500 pl-4"
                                >

                                    <p className="font-medium">

                                        👨‍⚕️ New Doctor:{" "}

                                        <span className="font-bold">

                                            Dr. {doctor.firstName} {doctor.lastName}

                                        </span>

                                    </p>

                                    <span className="text-sm text-gray-500">

                                        {doctor.specialization}

                                    </span>

                                </div>

                            ))}

                            {/* Recent Appointments */}

                            {recentAppointments.map((appointment) => (

                                <div
                                    key={`appointment-${appointment.id}`}
                                    className="border-l-4 border-purple-500 pl-4"
                                >

                                    <p className="font-medium">

                                        📅 Appointment Booked

                                    </p>

                                    <span className="text-sm text-gray-500">

                                        {appointment.patientName} → {appointment.doctorName}

                                    </span>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">

                    <PatientsChart />

                    <AppointmentPieChart />

                </div>
                
            </div>

        </Layout>

    );

};

export default HomeDashboard;