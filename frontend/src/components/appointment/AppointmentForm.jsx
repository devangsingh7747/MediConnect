import { useState, useEffect } from "react";

import Button from "../common/Button";
import Input from "../common/Input";

const AppointmentForm = ({ onSubmit, editingAppointment }) => {

    const [formData, setFormData] = useState({

        patientName: "",
        patientEmail: "",
        problem: "",
        appointmentDate: "",
        appointmentTime: ""

    });

    useEffect(() => {

        if (editingAppointment) {

            setFormData({

                patientName: editingAppointment.patientName || "",
                patientEmail: editingAppointment.patientEmail || "",
                problem: editingAppointment.problem || "",
                appointmentDate: editingAppointment.appointmentDate || "",
                appointmentTime: editingAppointment.appointmentTime || ""

            });

        } else {

            setFormData({

                patientName: "",
                patientEmail: "",
                problem: "",
                appointmentDate: "",
                appointmentTime: ""

            });

        }

    }, [editingAppointment]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({

            ...prev,
            [name]: value

        }));

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit(formData);

        if (!editingAppointment) {

            setFormData({

                patientName: "",
                patientEmail: "",
                problem: "",
                appointmentDate: "",
                appointmentTime: ""

            });

        }

    };

    return (

        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-md p-6 mb-8"
        >

            <h2 className="text-2xl font-semibold mb-6">

                Appointment Details

            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <Input
                    name="patientName"
                    type="text"
                    placeholder="Patient Name"
                    value={formData.patientName}
                    onChange={handleChange}
                    required
                />

                <Input
                    name="patientEmail"
                    type="email"
                    placeholder="Patient Email"
                    value={formData.patientEmail}
                    onChange={handleChange}
                    required
                />

                <select
                    name="problem"
                    value={formData.problem}
                    onChange={handleChange}
                    required
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                <Input
                    name="appointmentDate"
                    type="date"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    required
                />

                <Input
                    name="appointmentTime"
                    type="time"
                    value={formData.appointmentTime}
                    onChange={handleChange}
                    required
                />

            </div>

            <div className="mt-6">

                <Button type="submit">

                    {editingAppointment
                        ? "Update Appointment"
                        : "Book Appointment"}

                </Button>

            </div>

        </form>

    );

};

export default AppointmentForm;