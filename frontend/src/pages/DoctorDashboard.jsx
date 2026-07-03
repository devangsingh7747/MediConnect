import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import DoctorForm from "../components/doctor/DoctorForm";
import Layout from "../components/layout/Layout";

const DoctorDashboard = () => {

    const [doctors, setDoctors] = useState([]);
    const [editingDoctor, setEditingDoctor] = useState(null);

    const fetchDoctors = useCallback(async () => {

        try {

            const response = await api.get("/doctors");

            setDoctors(response.data);

        } catch (error) {

            console.error("Failed to fetch doctors:", error);

        }

    }, []);

    const addDoctor = async (doctor) => {

        try {

            if (editingDoctor) {

                await api.put(
                    `/doctors/${editingDoctor.id}`,
                    doctor
                );

                setEditingDoctor(null);

            } else {

                await api.post("/doctors", doctor);

            }

            await fetchDoctors();

        } catch (error) {

            console.error(error);

            alert("Operation failed.");

        }

    };

    const deleteDoctor = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this doctor?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(`/doctors/${id}`);

            await fetchDoctors();

        } catch (error) {

            console.error(error);

            alert("Failed to delete doctor.");

        }

    };

    useEffect(() => {

        fetchDoctors();

    }, [fetchDoctors]);

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

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-xl font-semibold mb-4">
                        Doctors
                    </h2>

                    {
                        doctors.length === 0 ? (

                            <p className="text-gray-500">
                                No doctors found.
                            </p>

                        ) : (

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
                                        doctors.map((doctor) => (

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

                        )
                    }

                </div>

            </div>
        </Layout>

    );

};

export default DoctorDashboard;