import { useState, useEffect } from "react";
import Button from "../common/Button";
import Input from "../common/Input";

const AppointmentForm = ({ onSubmit, editingAppointment }) => {

    const [formData, setFormData] = useState({
        patientName: "",
        doctorName: "",
        appointmentDate: "",
        appointmentTime: "",
        status: ""
    });

    useEffect(() => {

        if (editingAppointment) {

            setFormData({

                patientName: editingAppointment.patientName || "",

                doctorName: editingAppointment.doctorName || "",

                appointmentDate: editingAppointment.appointmentDate || "",

                appointmentTime: editingAppointment.appointmentTime || "",

                status: editingAppointment.status || ""

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

        setFormData({
            patientName: "",
            doctorName: "",
            appointmentDate: "",
            appointmentTime: "",
            status: ""
        });

    };

    return (

        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow p-6 mb-8"
        >

            <h2 className="text-2xl font-semibold mb-5">
                Appointment Details
            </h2>

            <div className="grid grid-cols-2 gap-4">

                <Input
                    name="patientName"
                    type="text"
                    placeholder="Patient Name"
                    value={formData.patientName}
                    onChange={handleChange}
                    required
                />

                <Input
                    name="doctorName"
                    type="text"
                    placeholder="Doctor Name"
                    value={formData.doctorName}
                    onChange={handleChange}
                    required
                />

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

                <Input
                    name="status"
                    type="text"
                    placeholder="Status"
                    value={formData.status}
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