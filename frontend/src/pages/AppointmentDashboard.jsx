import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import AppointmentForm from "../components/appointment/AppointmentForm";
import Layout from "../components/layout/Layout";

const AppointmentDashboard = () => {

    const [currentPage, setCurrentPage] = useState(1);

    const recordsPerPage = 5;

    const [appointments, setAppointments] = useState([]);
    const [editingAppointment, setEditingAppointment] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

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

            await fetchAppointments();

        } catch (error) {

            console.error(error);

            let message = "Operation failed.";

            if (error.response) {

                if (typeof error.response.data === "string") {

                    message = error.response.data;

                } else if (error.response.data?.message) {

                    message = error.response.data.message;

                }

            }

            alert(message);

        }

    };

    const updateStatus = async (id, status) => {

        try {

            await api.put(`/appointments/${id}/status`, {
                status,
            });

            await fetchAppointments();

        } catch (error) {

            console.error(error);

            alert("Failed to update appointment status.");

        }

    };

    const deleteAppointment = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this appointment?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(`/appointments/${id}`);

            await fetchAppointments();

        } catch (error) {

            console.error(error);

            alert("Failed to delete appointment.");

        }

    };

    useEffect(() => {

        fetchAppointments();

    }, [fetchAppointments]);

    const filteredAppointments = appointments.filter((appointment) => {

        const matchesSearch =
            (appointment.patientName || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||

            (appointment.doctorName || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "All" ||
            appointment.status === statusFilter;

        return matchesSearch && matchesStatus;

    });

    useEffect(() => {

        setCurrentPage(1);

    }, [searchTerm, statusFilter]);

    const lastIndex = currentPage * recordsPerPage;

    const firstIndex = lastIndex - recordsPerPage;

    const currentAppointments =
        filteredAppointments.slice(firstIndex, lastIndex);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredAppointments.length / recordsPerPage)
    );

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

    return (

        <Layout>

            <div className="p-6">

                <h1 className="text-4xl font-bold text-gray-800 mb-2">

                    Appointment Dashboard

                </h1>

                <p className="text-gray-500 mb-8">

                    Book appointments and let MediConnect automatically assign the most suitable doctor.

                </p>

                <AppointmentForm
                    onSubmit={saveAppointment}
                    editingAppointment={editingAppointment}
                />


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">

                    <div className="bg-blue-50 rounded-xl shadow p-5 border-l-4 border-blue-500">
                        <h3 className="text-gray-500 text-sm font-medium">
                            Total Appointments
                        </h3>
                        <p className="text-3xl font-bold text-blue-600 mt-2">
                            {totalAppointments}
                        </p>
                    </div>

                    <div className="bg-yellow-50 rounded-xl shadow p-5 border-l-4 border-yellow-500">
                        <h3 className="text-gray-500 text-sm font-medium">
                            Pending
                        </h3>
                        <p className="text-3xl font-bold text-yellow-600 mt-2">
                            {pendingAppointments}
                        </p>
                    </div>

                    <div className="bg-green-50 rounded-xl shadow p-5 border-l-4 border-green-500">
                        <h3 className="text-gray-500 text-sm font-medium">
                            Completed
                        </h3>
                        <p className="text-3xl font-bold text-green-600 mt-2">
                            {completedAppointments}
                        </p>
                    </div>

                    <div className="bg-red-50 rounded-xl shadow p-5 border-l-4 border-red-500">
                        <h3 className="text-gray-500 text-sm font-medium">
                            Cancelled
                        </h3>
                        <p className="text-3xl font-bold text-red-600 mt-2">
                            {cancelledAppointments}
                        </p>
                    </div>

                </div>


                <div className="bg-white rounded-xl shadow p-6">

                    <div className="flex justify-between items-center mb-6">

                        <h2 className="text-xl font-semibold">

                            Appointments

                        </h2>

                        <span className="text-gray-500">

                            {filteredAppointments.length} Records

                        </span>

                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mb-6">

                        <input
                            type="text"
                            placeholder="Search by Patient or Doctor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >

                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>

                        </select>

                    </div>

                    {filteredAppointments.length === 0 ? (

                        <p className="text-gray-500">

                            No appointments found.

                        </p>

                    ) : (

                        <>

                            <table className="w-full border-collapse">

                                <thead>

                                    <tr className="bg-gray-100">

                                        <th className="border p-3">ID</th>
                                        <th className="border p-3">Patient</th>
                                        <th className="border p-3">Problem</th>
                                        <th className="border p-3">Assigned Doctor</th>
                                        <th className="border p-3">Date</th>
                                        <th className="border p-3">Time</th>
                                        <th className="border p-3">Status</th>
                                        <th className="border p-3">Actions</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {currentAppointments.map((appointment) => (

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

                                                {appointment.problem}

                                            </td>

                                            <td className="border p-3 font-medium text-blue-600">

                                                Dr. {appointment.doctorName}

                                            </td>

                                            <td className="border p-3">

                                                {appointment.appointmentDate}

                                            </td>

                                            <td className="border p-3">

                                                {appointment.appointmentTime}

                                            </td>

                                            <td className="border p-3">

                                                <span
                                                    className={`px-3 py-1 rounded-full text-white text-sm ${
                                                        appointment.status === "Completed"
                                                            ? "bg-green-500"
                                                            : appointment.status === "Cancelled"
                                                            ? "bg-red-500"
                                                            : "bg-yellow-500"
                                                    }`}
                                                >

                                                    {appointment.status}

                                                </span>

                                            </td>

                                            <td className="border p-3">

                                                <div className="flex flex-wrap justify-center gap-2">

                                                    {appointment.status === "Pending" && (

                                                        <>
                                                            <button
                                                                onClick={() =>
                                                                    updateStatus(
                                                                        appointment.id,
                                                                        "Completed"
                                                                    )
                                                                }
                                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition"
                                                            >

                                                                Complete

                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    updateStatus(
                                                                        appointment.id,
                                                                        "Cancelled"
                                                                    )
                                                                }
                                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                                                            >

                                                                Cancel

                                                            </button>
                                                        </>

                                                    )}

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
                                                        className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded-lg transition"
                                                    >

                                                        Delete

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                            <div className="flex justify-between items-center mt-6">

                                <p className="text-gray-600">

                                    Showing{" "}

                                    {filteredAppointments.length === 0
                                        ? 0
                                        : firstIndex + 1}

                                    -

                                    {Math.min(lastIndex, filteredAppointments.length)}

                                    {" "}of{" "}

                                    {filteredAppointments.length}

                                </p>

                                <div className="flex gap-2">

                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() =>
                                            setCurrentPage((page) =>
                                                Math.max(page - 1, 1)
                                            )
                                        }
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition cursor-pointer disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                                    >

                                        Previous

                                    </button>

                                    <span className="px-4 py-2">

                                        {currentPage} / {totalPages}

                                    </span>

                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() =>
                                            setCurrentPage((page) =>
                                                Math.min(page + 1, totalPages)
                                            )
                                        }
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition cursor-pointer disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                                    >

                                        Next

                                    </button>

                                </div>

                            </div>

                        </>

                    )}

                </div>

            </div>

        </Layout>

    );

};

export default AppointmentDashboard;