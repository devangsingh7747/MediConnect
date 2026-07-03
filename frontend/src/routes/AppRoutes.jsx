import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import HomeDashboard from "../pages/HomeDashboard";
import Dashboard from "../pages/Dashboard";
import DoctorDashboard from "../pages/DoctorDashboard";
import AppointmentDashboard from "../pages/AppointmentDashboard";
import ProtectedRoute from "./ProtectedRoute";

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
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <HomeDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/doctor-dashboard"
                    element={
                        <ProtectedRoute>
                            <DoctorDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/appointment-dashboard"
                    element={
                        <ProtectedRoute>
                            <AppointmentDashboard />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}

export default AppRoutes;