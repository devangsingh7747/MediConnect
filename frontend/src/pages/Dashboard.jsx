import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import PatientForm from "../components/patient/PatientForm";
import Layout from "../components/layout/Layout";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import {
    exportToPDF,
    exportToExcel
} from "../utils/reportUtils";

import EmptyState from "../components/common/EmptyState";

import Loader from "../components/common/Loader";

const Dashboard = () => {

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPatient, setEditingPatient] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const recordsPerPage = 5;

    const fetchPatients = useCallback(async () => {
        try {

            setLoading(true);

            const response = await api.get("/patients");

            setPatients(response.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }
    }, []);

    const addPatient = async (patient) => {

        const isEditing = editingPatient !== null;

        try {

            if (isEditing) {

                await api.put(
                    `/patients/${editingPatient.id}`,
                    patient
                );

                setEditingPatient(null);

            } else {

                await api.post("/patients", patient);

            }

            await fetchPatients();

            toast.success(
                isEditing
                    ? "Patient updated successfully!"
                    : "Patient added successfully!"
            );

        } catch (error) {

            console.error(error);

            toast.error("Operation failed.");

        }

    };


    const deletePatient = async (id) => {

        const result = await Swal.fire({
            title: "Delete Patient?",
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

            await api.delete(`/patients/${id}`);

            await fetchPatients();

            toast.success("Patient deleted successfully!");

        } catch (error) {

            console.error(error);

            toast.error("Failed to delete patient.");

        }

    };


    const handleExportPDF = () => {

        exportToPDF(

            "Patients Report",

            [
                "ID",
                "First Name",
                "Last Name",
                "Email",
                "Phone",
                "Age",
                "Gender"
            ],

            filteredPatients.map(patient => [

                patient.id,
                patient.firstName,
                patient.lastName,
                patient.email,
                patient.phone,
                patient.age,
                patient.gender

            ]),

            "patients-report"

        );

    };

    const handleExportExcel = () => {

        exportToExcel(

            filteredPatients,

            "patients-report"

        );

    };


    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    const filteredPatients = patients.filter((patient) => {

        return (
            `${patient.firstName} ${patient.lastName}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||

            (patient.email || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||

            (patient.phone || "")
                .includes(searchTerm)
        );

    });


    useEffect(() => {

        setCurrentPage(1);

    }, [searchTerm]);



    const totalPatients = patients.length;

    const malePatients = patients.filter(
        (patient) => patient.gender === "Male"
    ).length;

    const femalePatients = patients.filter(
        (patient) => patient.gender === "Female"
    ).length;

    const averageAge =
        totalPatients === 0
            ? 0
            : Math.round(
                patients.reduce(
                    (sum, patient) => sum + Number(patient.age),
                    0
                ) / totalPatients
            );

    const lastIndex = currentPage * recordsPerPage;

    const firstIndex = lastIndex - recordsPerPage;

    const currentPatients =
        filteredPatients.slice(firstIndex, lastIndex);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredPatients.length / recordsPerPage)
    );


    if (loading) {

        return <Loader />;

    }


    return (
        <Layout>
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6">
                    Patient Dashboard
                </h1>

                <PatientForm
                    onSubmit={addPatient}
                    editingPatient={editingPatient}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">

                <div className="bg-blue-50 rounded-xl shadow p-5 border-l-4 border-blue-500">

                    <h3 className="text-gray-500 text-sm font-medium">

                        Total Patients

                    </h3>

                    <p className="text-3xl font-bold text-blue-600 mt-2">

                        {totalPatients}

                    </p>

                </div>

                <div className="bg-green-50 rounded-xl shadow p-5 border-l-4 border-green-500">

                    <h3 className="text-gray-500 text-sm font-medium">

                        Male

                    </h3>

                    <p className="text-3xl font-bold text-green-600 mt-2">

                        {malePatients}

                    </p>

                </div>

                <div className="bg-pink-50 rounded-xl shadow p-5 border-l-4 border-pink-500">

                    <h3 className="text-gray-500 text-sm font-medium">

                        Female

                    </h3>

                    <p className="text-3xl font-bold text-pink-600 mt-2">

                        {femalePatients}

                    </p>

                </div>

                <div className="bg-yellow-50 rounded-xl shadow p-5 border-l-4 border-yellow-500">

                    <h3 className="text-gray-500 text-sm font-medium">

                        Average Age

                    </h3>

                    <p className="text-3xl font-bold text-yellow-600 mt-2">

                        {averageAge}

                    </p>

                </div>

            </div>


                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex justify-between items-center mb-6">

                        <h2 className="text-xl font-semibold">
                            Patients
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
                                {filteredPatients.length} Records
                            </span>

                        </div>

                    </div>

                    <div className="mb-6">

                        <input
                            type="text"
                            placeholder="Search by Name, Email or Phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    {filteredPatients.length === 0 ? (
                        <EmptyState
                            title="No Patients Found"
                            description="Click 'Add Patient' above to create your first patient."
                        />
                    ) : (
                        <>

                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border p-3">ID</th>
                                        <th className="border p-3">First Name</th>
                                        <th className="border p-3">Last Name</th>
                                        <th className="border p-3">Email</th>
                                        <th className="border p-3">Phone</th>
                                        <th className="border p-3">Age</th>
                                        <th className="border p-3">Gender</th>
                                        <th className="border p-3">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {currentPatients.map((patient) => (
                                        <tr
                                            key={patient.id}
                                            className="text-center hover:bg-gray-50"
                                        >
                                            <td className="border p-3">
                                                {patient.id}
                                            </td>

                                            <td className="border p-3">
                                                {patient.firstName}
                                            </td>

                                            <td className="border p-3">
                                                {patient.lastName}
                                            </td>

                                            <td className="border p-3">
                                                {patient.email}
                                            </td>

                                            <td className="border p-3">
                                                {patient.phone}
                                            </td>

                                            <td className="border p-3">
                                                {patient.age}
                                            </td>

                                            <td className="border p-3">
                                                {patient.gender}
                                            </td>

                                            <td className="border p-3">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => setEditingPatient(patient)}
                                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg transition"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() => deletePatient(patient.id)}
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


                            <div className="flex justify-between items-center mt-6">

                                <p className="text-gray-600">

                                    Showing{" "}

                                    {filteredPatients.length === 0
                                        ? 0
                                        : firstIndex + 1}

                                    -

                                    {Math.min(lastIndex, filteredPatients.length)}

                                    {" "}of{" "}

                                    {filteredPatients.length}

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

export default Dashboard;