import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import DoctorForm from "../components/doctor/DoctorForm";
import Layout from "../components/layout/Layout";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import {
    exportToPDF,
    exportToExcel
} from "../utils/reportUtils";

import EmptyState from "../components/common/EmptyState";

import Loader from "../components/common/Loader";

const DoctorDashboard = () => {

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingDoctor, setEditingDoctor] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const recordsPerPage = 5;

    const fetchDoctors = useCallback(async () => {

        try {

            setLoading(true);

            const response = await api.get("/doctors");

            setDoctors(response.data);

        } catch (error) {

            console.error("Failed to fetch doctors:", error);

        } finally {

            setLoading(false);

        }

    }, []);

    const addDoctor = async (doctor) => {

        const isEditing = editingDoctor !== null;

        try {

            if (isEditing) {

                await api.put(
                    `/doctors/${editingDoctor.id}`,
                    doctor
                );

                setEditingDoctor(null);

            } else {

                await api.post("/doctors", doctor);

            }

            await fetchDoctors();

            toast.success(
                isEditing
                    ? "Doctor updated successfully!"
                    : "Doctor added successfully!"
            );

        } catch (error) {

            console.error(error);

            toast.error("Operation failed.");

        }

    };

    const deleteDoctor = async (id) => {

        const result = await Swal.fire({
            title: "Delete Doctor?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#2563eb",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, Delete",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) return;

        try {

            await api.delete(`/doctors/${id}`);

            await fetchDoctors();

            toast.success("Doctor deleted successfully!");

        } catch (error) {

            console.error(error);

            toast.error("Failed to delete doctor.");

        }

    };


    const handleExportPDF = () => {

        exportToPDF(

            "Doctors Report",

            [
                "ID",
                "First Name",
                "Last Name",
                "Specialization",
                "Email",
                "Phone",
                "Experience",
                "Hospital",
                "Availability"
            ],

            filteredDoctors.map(doctor => [

                doctor.id,
                doctor.firstName,
                doctor.lastName,
                doctor.specialization,
                doctor.email,
                doctor.phone,
                doctor.experience,
                doctor.hospital,
                doctor.availability

            ]),

            "doctors-report"

        );

    };

    const handleExportExcel = () => {

        exportToExcel(

            filteredDoctors,

            "doctors-report"

        );

    };



    useEffect(() => {

        fetchDoctors();

    }, [fetchDoctors]);

    const filteredDoctors = doctors.filter((doctor) => {

        return (
            `${doctor.firstName} ${doctor.lastName}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||

            (doctor.specialization || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||

            (doctor.hospital || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );

    });

    useEffect(() => {

        setCurrentPage(1);

    }, [searchTerm]);

    const totalDoctors = doctors.length;

    const availableDoctors = doctors.filter(
        (doctor) => doctor.availability === "Available"
    ).length;

    const unavailableDoctors = doctors.filter(
        (doctor) => doctor.availability === "Unavailable"
    ).length;

    const averageExperience =
        totalDoctors === 0
            ? 0
            : Math.round(
                doctors.reduce(
                    (sum, doctor) => sum + Number(doctor.experience),
                    0
                ) / totalDoctors
            );

    const lastIndex = currentPage * recordsPerPage;

    const firstIndex = lastIndex - recordsPerPage;

    const currentDoctors =
        filteredDoctors.slice(firstIndex, lastIndex);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredDoctors.length / recordsPerPage)
    );


    if (loading) {

        return (
            <Layout>
                <Loader />
            </Layout>
        );

    }



    return (
        <Layout>

            <div className="p-6">

                <h1 className="text-3xl font-bold mb-6">
                    Doctor Dashboard
                </h1>

                <DoctorForm
                    onSubmit={addDoctor}
                    editingDoctor={editingDoctor}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">

                <div className="bg-blue-50 rounded-xl shadow p-5 border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm font-medium">
                        Total Doctors
                    </h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                        {totalDoctors}
                    </p>
                </div>

                <div className="bg-green-50 rounded-xl shadow p-5 border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm font-medium">
                        Available
                    </h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                        {availableDoctors}
                    </p>
                </div>

                <div className="bg-red-50 rounded-xl shadow p-5 border-l-4 border-red-500">
                    <h3 className="text-gray-500 text-sm font-medium">
                        Unavailable
                    </h3>
                    <p className="text-3xl font-bold text-red-600 mt-2">
                        {unavailableDoctors}
                    </p>
                </div>

                <div className="bg-yellow-50 rounded-xl shadow p-5 border-l-4 border-yellow-500">
                    <h3 className="text-gray-500 text-sm font-medium">
                        Avg. Experience
                    </h3>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">
                        {averageExperience} yrs
                    </p>
                </div>

            </div>

            <div className="bg-white rounded-xl shadow p-6">

                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-xl font-semibold">
                        Doctors
                    </h2>

                    <div className="flex items-center gap-3">

                        <button
                            onClick={handleExportPDF}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                        >
                            Export PDF
                        </button>

                        <button
                            onClick={handleExportExcel}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                        >
                            Export Excel
                        </button>

                        <span className="text-gray-500">
                            {filteredDoctors.length} Records
                        </span>

                    </div>

                </div>

                <div className="mb-6">

                    <input
                        type="text"
                        placeholder="Search by Name, Specialization or Hospital..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>

                    {
                        filteredDoctors.length === 0 ? (

                            <EmptyState
                                title="No Doctors Found"
                                description="Click 'Add Doctor' above to create your first doctor."
                            />

                        ) : (

                            <>

                                <table className="w-full border-collapse">

                                    <thead>

                                        <tr className="bg-gray-100">

                                            <th className="border p-3">ID</th>
                                            <th className="border p-3">First Name</th>
                                            <th className="border p-3">Last Name</th>
                                            <th className="border p-3">Specialization</th>
                                            <th className="border p-3">Email</th>
                                            <th className="border p-3">Phone</th>
                                            <th className="border p-3">Experience</th>
                                            <th className="border p-3">Hospital</th>
                                            <th className="border p-3">Availability</th>
                                            <th className="border p-3">Actions</th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {
                                            currentDoctors.map((doctor) => (

                                                <tr
                                                    key={doctor.id}
                                                    className="text-center hover:bg-gray-50"
                                                >

                                                    <td className="border p-3">{doctor.id}</td>

                                                    <td className="border p-3">{doctor.firstName}</td>

                                                    <td className="border p-3">{doctor.lastName}</td>

                                                    <td className="border p-3">{doctor.specialization}</td>

                                                    <td className="border p-3">{doctor.email}</td>

                                                    <td className="border p-3">{doctor.phone}</td>

                                                    <td className="border p-3">{doctor.experience}</td>

                                                    <td className="border p-3">{doctor.hospital}</td>

                                                    <td className="border p-3">{doctor.availability}</td>

                                                    <td className="border p-3">

                                                        <div className="flex justify-center gap-2">

                                                            <button
                                                                onClick={() => setEditingDoctor(doctor)}
                                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg transition"
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                onClick={() => deleteDoctor(doctor.id)}
                                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition"
                                                            >
                                                                Delete
                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            ))
                                        }

                                    </tbody>

                                </table>

                                <div className="flex justify-between items-center mt-6">

                                <p className="text-gray-600">

                                    Showing{" "}

                                    {filteredDoctors.length === 0
                                        ? 0
                                        : firstIndex + 1}

                                    -

                                    {Math.min(lastIndex, filteredDoctors.length)}

                                    {" "}of{" "}

                                    {filteredDoctors.length}

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

                        )
                    }

                </div>

            </div>
        </Layout>

    );

};

export default DoctorDashboard;