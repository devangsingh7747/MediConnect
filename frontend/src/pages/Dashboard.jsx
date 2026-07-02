import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import PatientForm from "../components/patient/PatientForm";

const Dashboard = () => {

    const [patients, setPatients] = useState([]);
    const [editingPatient, setEditingPatient] = useState(null);

    const fetchPatients = useCallback(async () => {
        try {
            const response = await api.get("/patients");
            setPatients(response.data);
        } catch (error) {
            console.error("Failed to fetch patients:", error);
        }
    }, []);

    const addPatient = async (patient) => {

        try {

            if (editingPatient) {

                await api.put(
                    `/patients/${editingPatient.id}`,
                    patient
                );

                setEditingPatient(null);

            } else {

                await api.post("/patients", patient);

            }

            await fetchPatients();

        } catch (error) {

            console.error(error);

            alert("Operation failed.");

        }

    };


    const deletePatient = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this patient?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(`/patients/${id}`);

            fetchPatients();

        } catch (error) {

            console.error(error);

            alert("Failed to delete patient.");

        }

    };


    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    return (
        <div className="min-h-screen bg-gray-100 p-10">
            <h1 className="text-3xl font-bold mb-6">
                Dashboard
            </h1>

            <PatientForm
                onSubmit={addPatient}
                editingPatient={editingPatient}
            />

            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                    Patients
                </h2>

                {patients.length === 0 ? (
                    <p className="text-gray-500">No patients found.</p>
                ) : (
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
                            {patients.map((patient) => (
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
                )}

            </div>
        </div>
    );
};

export default Dashboard;