import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";

import HomeDashboard from "../pages/HomeDashboard";
import Dashboard from "../pages/Dashboard";
import DoctorDashboard from "../pages/DoctorDashboard";
import AppointmentDashboard from "../pages/AppointmentDashboard";

import PatientDashboard from "../pages/patient/PatientDashboard";
import DoctorPortalDashboard from "../pages/doctor/DoctorDashboard";

import ProtectedRoute from "./ProtectedRoute";

import PatientAppointments from "../pages/patient/PatientAppointments";
import DiseaseAnalysis from "../pages/patient/DiseaseAnalysis";
import PatientNotifications from "../pages/patient/PatientNotifications";
import PatientProfile from "../pages/patient/PatientProfile";

import BookAppointment from "../pages/appointment/BookAppointment";

import DoctorAppointments from "../pages/doctor/DoctorAppointments";
import DoctorNotifications from "../pages/doctor/DoctorNotifications";
import DoctorProfile from "../pages/doctor/DoctorProfile";

function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/patient/home"
                    element={
                        <ProtectedRoute allowedRoles={["PATIENT"]}>

                            <PatientDashboard />

                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/doctor/home"
                    element={
                        <ProtectedRoute allowedRoles={["DOCTOR"]}>

                            <DoctorPortalDashboard />

                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/doctor/appointments"
                    element={
                        <ProtectedRoute allowedRoles={["DOCTOR"]}>
                            <DoctorAppointments />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/doctor/notifications"
                    element={
                        <ProtectedRoute allowedRoles={["DOCTOR"]}>
                            <DoctorNotifications />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/doctor/profile"
                    element={
                        <ProtectedRoute allowedRoles={["DOCTOR"]}>
                            <DoctorProfile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/home"
                    element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>

                            <HomeDashboard />

                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>

                            <Dashboard />

                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/doctor-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>

                            <DoctorDashboard />

                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/appointment-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>

                            <AppointmentDashboard />

                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/patient/appointments"
                    element={
                        <ProtectedRoute allowedRoles={["PATIENT"]}>
                            <PatientAppointments />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/patient/disease-analysis"
                    element={
                        <ProtectedRoute allowedRoles={["PATIENT"]}>
                            <DiseaseAnalysis />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/patient/notifications"
                    element={
                        <ProtectedRoute allowedRoles={["PATIENT"]}>
                            <PatientNotifications />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/patient/profile"
                    element={
                        <ProtectedRoute allowedRoles={["PATIENT"]}>
                            <PatientProfile />
                        </ProtectedRoute>
                    }
                />

                <Route

                    path="/appointment"

                    element={

                        <ProtectedRoute
                            allowedRoles={["PATIENT"]}
                        >

                            <BookAppointment />

                        </ProtectedRoute>

                    }

                />

                <Route
                    path="*"
                    element={<NotFound />}
                />

            </Routes>

        </BrowserRouter>

    );

}

export default AppRoutes;