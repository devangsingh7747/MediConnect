import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import AppointmentForm from "../components/appointment/AppointmentForm";
import Layout from "../components/layout/Layout";

const AppointmentDashboard = () => {

    const [appointments, setAppointments] = useState([]);
    const [editingAppointment, setEditingAppointment] = useState(null);

    const fetchAppointments = useCallback(async () => {

        try {

            const response = await api.get("/appointments");

            setAppointments(response.data);

        } catch (error) {

            console.error("Failed to fetch appointments:", error);

        }

    }, []);

    const saveAppointment = async (appointment) => {

        try {

            if (editingAppointment) {

                await api.put(
                    `/appointments/${editingAppointment.id}`,
                    appointment
                );

                setEditingAppointment(null);

            } else {

                await api.post("/appointments", appointment);

            }

            fetchAppointments();

        } catch (error) {

            console.error(error);

            alert("Operation failed.");

        }

    };

    const deleteAppointment = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this appointment?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(`/appointments/${id}`);

            fetchAppointments();

        } catch (error) {

            console.error(error);

            alert("Failed to delete appointment.");

        }

    };

    useEffect(() => {

        fetchAppointments();

    }, [fetchAppointments]);

    return (
        <Layout>

            <div className="p-6">

                <h1 className="text-3xl font-bold mb-6">
                    Appointment Dashboard
                </h1>

                <AppointmentForm
                    onSubmit={saveAppointment}
                    editingAppointment={editingAppointment}
                />

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-xl font-semibold mb-4">
                        Appointments
                    </h2>

                    {appointments.length === 0 ? (

                        <p className="text-gray-500">
                            No appointments found.
                        </p>

                    ) : (

                        <table className="w-full border-collapse">

                            <thead>

                                <tr className="bg-gray-100">

                                    <th className="border p-3">ID</th>

                                    <th className="border p-3">Patient</th>

                                    <th className="border p-3">Doctor</th>

                                    <th className="border p-3">Date</th>

                                    <th className="border p-3">Time</th>

                                    <th className="border p-3">Status</th>

                                    <th className="border p-3">Actions</th>

                                </tr>

                            </thead>

                            <tbody>

                                {appointments.map((appointment) => (

                                    <tr
                                        key={appointment.id}
                                        className="text-center hover:bg-gray-50"
                                    >

                                        <td className="border p-3">
                                            {appointment.id}
                                        </td>

                                        <td className="border p-3">
                                            {appointment.patientName}
                                        </td>

                                        <td className="border p-3">
                                            {appointment.doctorName}
                                        </td>

                                        <td className="border p-3">
                                            {appointment.appointmentDate}
                                        </td>

                                        <td className="border p-3">
                                            {appointment.appointmentTime}
                                        </td>

                                        <td className="border p-3">
                                            {appointment.status}
                                        </td>

                                        <td className="border p-3">

                                            <div className="flex justify-center gap-2">

                                                <button
                                                    onClick={() =>
                                                        setEditingAppointment(appointment)
                                                    }
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg transition"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        deleteAppointment(appointment.id)
                                                    }
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition"
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    )}

                </div>

            </div>

        </Layout>

    );

};

export default AppointmentDashboard;