import { useState } from "react";
import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";
import { toast } from "react-toastify";

import PatientLayout from "../../components/patient/PatientLayout";
import api from "../../services/api";

const getErrorMessage = (error) => {
    const responseData = error?.response?.data;

    if (
        typeof responseData === "string" &&
        responseData.trim()
    ) {
        return responseData;
    }

    if (
        typeof responseData?.message === "string" &&
        responseData.message.trim()
    ) {
        return responseData.message;
    }

    if (
        typeof responseData?.error === "string" &&
        responseData.error.trim()
    ) {
        return responseData.error;
    }

    if (
        typeof error?.message === "string" &&
        error.message.trim()
    ) {
        return error.message;
    }

    return "Unable to book the appointment. Please try again.";
};

const BookAppointment = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const suggestedProblem =
        searchParams.get("problem") || "";

    let savedUser;

    try {
        savedUser =
            JSON.parse(
                localStorage.getItem("user") || "{}"
            ) || {};
    } catch {
        savedUser = {};
    }

    const [formData, setFormData] = useState({
        patientName: savedUser.fullName || "",
        patientEmail: savedUser.email || "",
        problem: suggestedProblem,
        appointmentDate: "",
        appointmentTime: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            !formData.patientName ||
            !formData.patientEmail
        ) {
            toast.error(
                "Patient information is missing. Please log in again."
            );
            return;
        }

        if (!formData.problem) {
            toast.warning("Please select a health problem.");
            return;
        }

        if (!formData.appointmentDate) {
            toast.warning("Please select an appointment date.");
            return;
        }

        if (!formData.appointmentTime) {
            toast.warning("Please select an appointment time.");
            return;
        }

        try {
            setLoading(true);

            await api.post(
                "/appointments",
                formData
            );

            toast.success(
                "Appointment booked successfully!"
            );

            navigate("/patient/appointments");
        } catch (error) {
            console.error(
                "Appointment booking failed:",
                error
            );

            const message =
                getErrorMessage(error);

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PatientLayout>
            <div className="mx-auto max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Book Appointment
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Select your health concern, preferred
                        date, and time.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl bg-white p-8 shadow"
                >
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Patient Name
                            </label>

                            <input
                                type="text"
                                value={
                                    formData.patientName
                                }
                                disabled
                                className="w-full cursor-not-allowed rounded-xl border bg-gray-100 px-4 py-3 text-gray-600"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Patient Email
                            </label>

                            <input
                                type="email"
                                value={
                                    formData.patientEmail
                                }
                                disabled
                                className="w-full cursor-not-allowed rounded-xl border bg-gray-100 px-4 py-3 text-gray-600"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Health Problem
                            </label>

                            <select
                                name="problem"
                                value={formData.problem}
                                onChange={handleChange}
                                required
                                className="w-full cursor-pointer rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">
                                    Select Problem
                                </option>

                                <option value="Chest Pain">
                                    Chest Pain
                                </option>

                                <option value="Heart Problem">
                                    Heart Problem
                                </option>

                                <option value="High BP">
                                    High BP
                                </option>

                                <option value="Headache">
                                    Headache
                                </option>

                                <option value="Migraine">
                                    Migraine
                                </option>

                                <option value="Skin Allergy">
                                    Skin Allergy
                                </option>

                                <option value="Acne">
                                    Acne
                                </option>

                                <option value="Fever">
                                    Fever
                                </option>

                                <option value="Cold">
                                    Cold
                                </option>

                                <option value="Cough">
                                    Cough
                                </option>

                                <option value="Bone Fracture">
                                    Bone Fracture
                                </option>

                                <option value="Back Pain">
                                    Back Pain
                                </option>

                                <option value="Eye Pain">
                                    Eye Pain
                                </option>

                                <option value="Vision Problem">
                                    Vision Problem
                                </option>

                                <option value="Pregnancy">
                                    Pregnancy
                                </option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Appointment Date
                            </label>

                            <input
                                type="date"
                                name="appointmentDate"
                                value={
                                    formData.appointmentDate
                                }
                                onChange={handleChange}
                                min={new Date()
                                    .toISOString()
                                    .split("T")[0]}
                                required
                                className="w-full cursor-pointer rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Appointment Time
                            </label>

                            <input
                                type="time"
                                name="appointmentTime"
                                value={
                                    formData.appointmentTime
                                }
                                onChange={handleChange}
                                required
                                className="w-full cursor-pointer rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 cursor-pointer rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                        >
                            {loading
                                ? "Booking Appointment..."
                                : "Book Appointment"}
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/patient/home"
                                )
                            }
                            className="cursor-pointer rounded-xl border border-gray-300 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 sm:w-40"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </PatientLayout>
    );
};

export default BookAppointment;