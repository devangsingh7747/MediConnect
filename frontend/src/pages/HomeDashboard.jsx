import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PatientsChart from "../components/dashboard/PatientsChart";
import AppointmentPieChart from "../components/dashboard/AppointmentPieChart";
import DoctorSpecializationChart from "../components/dashboard/DoctorSpecializationChart";

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

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [patientCount, setPatientCount] = useState(0);
    const [doctorCount, setDoctorCount] = useState(0);
    const [appointmentCount, setAppointmentCount] = useState(0);

    const [pendingCount, setPendingCount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const [cancelledCount, setCancelledCount] = useState(0);

    const [recentPatients, setRecentPatients] = useState([]);
    const [recentDoctors, setRecentDoctors] = useState([]);
    const [recentAppointments, setRecentAppointments] = useState([]);

    const fetchDashboardData = async () => {

        try {

            console.log("Fetching dashboard...");

            const response = await api.get("/dashboard");

            console.log("Dashboard Response:", response);

            console.log("Dashboard Data:", response.data);

            setPatientCount(response.data.patientCount);
            setDoctorCount(response.data.doctorCount);
            setAppointmentCount(response.data.appointmentCount);

            setPendingCount(response.data.pendingAppointments);
            setCompletedCount(response.data.completedAppointments);
            setCancelledCount(response.data.cancelledAppointments);

            setRecentPatients(response.data.recentPatients);
            setRecentDoctors(response.data.recentDoctors);
            setRecentAppointments(response.data.recentAppointments);

        } catch (error) {

            console.error("Dashboard Error:", error);

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

                {/* Stats */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">

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
                        title="Pending"
                        value={pendingCount}
                        color="text-yellow-600"
                        icon={<FaClipboardList className="text-yellow-600" />}
                    />

                    <StatsCard
                        title="Completed"
                        value={completedCount}
                        color="text-green-600"
                        icon={<FaClipboardList className="text-green-600" />}
                    />

                    <StatsCard
                        title="Cancelled"
                        value={cancelledCount}
                        color="text-red-600"
                        icon={<FaClipboardList className="text-red-600" />}
                    />

                </div>

                {/* Bottom */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">

                    <div className="bg-white rounded-2xl shadow-md p-6">

                        <h2 className="text-2xl font-semibold mb-6">

                            Quick Actions

                        </h2>

                        <div className="grid grid-cols-2 gap-4">

                            <button
                                onClick={() => navigate("/dashboard")}
                                className="bg-blue-50 hover:bg-blue-100 hover:shadow-lg hover:-translate-y-1 rounded-xl p-5 transition-all duration-300"
                            >

                                <div className="flex justify-center mb-4">

                                    <FaUserInjured className="text-4xl text-blue-600"/>

                                </div>

                                <p className="text-center font-semibold">

                                    Patients

                                </p>

                            </button>

                            <button
                                onClick={() => navigate("/doctor-dashboard")}
                                className="bg-green-50 hover:bg-green-100 hover:shadow-lg hover:-translate-y-1 rounded-xl p-5 transition-all duration-300"
                            >

                                <div className="flex justify-center mb-4">

                                    <FaUserMd className="text-4xl text-green-600"/>

                                </div>

                                <p className="text-center font-semibold">

                                    Doctors

                                </p>

                            </button>

                            <button
                                onClick={() => navigate("/appointment-dashboard")}
                                className="bg-purple-50 hover:bg-purple-100 hover:shadow-lg hover:-translate-y-1 rounded-xl p-5 transition-all duration-300"
                            >

                                <div className="flex justify-center mb-4">

                                    <FaCalendarCheck className="text-4xl text-purple-600"/>

                                </div>

                                <p className="text-center font-semibold">

                                    Appointments

                                </p>

                            </button>

                            <button
                                onClick={() => alert("Reports module is under development 🚀")}
                                className="bg-orange-50 hover:bg-orange-100 hover:shadow-lg hover:-translate-y-1 rounded-xl p-5 transition-all duration-300"
                            >

                                <div className="flex justify-center mb-4">

                                    <FaClipboardList className="text-4xl text-orange-600"/>

                                </div>

                                <p className="text-center font-semibold">

                                    Reports

                                </p>

                            </button>

                        </div>

                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-6">

                        <h2 className="text-2xl font-semibold mb-6">

                            Recent Activity

                        </h2>

                        <div className="space-y-5">

                            {recentPatients.map((patient) => (

                                <div
                                    key={`patient-${patient.id}`}
                                    className="border-l-4 border-blue-500 pl-4"
                                >

                                    <p className="font-medium">

                                        👤 New Patient:
                                        <span className="font-bold">
                                            {" "}
                                            {patient.firstName} {patient.lastName}
                                        </span>

                                    </p>

                                    <span className="text-sm text-gray-500">

                                        {patient.email}

                                    </span>

                                </div>

                            ))}

                            {recentDoctors.map((doctor) => (

                                <div
                                    key={`doctor-${doctor.id}`}
                                    className="border-l-4 border-green-500 pl-4"
                                >

                                    <p className="font-medium">

                                        👨‍⚕️ New Doctor:
                                        <span className="font-bold">
                                            {" "}
                                            Dr. {doctor.firstName} {doctor.lastName}
                                        </span>

                                    </p>

                                    <span className="text-sm text-gray-500">

                                        {doctor.specialization}

                                    </span>

                                </div>

                            ))}

                            {recentAppointments.map((appointment) => (

                                <div
                                    key={`appointment-${appointment.id}`}
                                    className="border-l-4 border-purple-500 pl-4"
                                >

                                    <p className="font-medium">

                                        📅 Appointment Booked

                                    </p>

                                    <span className="text-sm text-gray-500">

                                        {appointment.patientName} → Dr. {appointment.doctorName}

                                    </span>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

                    <PatientsChart />

                    <AppointmentPieChart />

                    <DoctorSpecializationChart />

                </div>

            </div>

        </Layout>

    );

};

export default HomeDashboard;