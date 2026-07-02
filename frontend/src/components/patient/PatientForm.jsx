import { useState, useEffect } from "react";
import Button from "../common/Button";
import Input from "../common/Input";

const PatientForm = ({ onSubmit, editingPatient }) => {

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        age: "",
        gender: ""
    });

    useEffect(() => {

        if (editingPatient) {

            setFormData({

                firstName: editingPatient.firstName || "",

                lastName: editingPatient.lastName || "",

                email: editingPatient.email || "",

                phone: editingPatient.phone || "",

                age: editingPatient.age || "",

                gender: editingPatient.gender || ""

            });

        }

    }, [editingPatient]);

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
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            age: "",
            gender: ""
        });

    };

    return (

        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow p-6 mb-8"
        >

            <h2 className="text-2xl font-semibold mb-5">
                {editingPatient ? "Update Patient" : "Add Patient"}
            </h2>

            <div className="grid grid-cols-2 gap-4">

                <Input
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />

                <Input
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />

                <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <Input
                    name="phone"
                    type="text"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />

                <Input
                    name="age"
                    type="number"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                />

                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="
                        w-full
                        px-4
                        py-3
                        rounded-xl
                        border
                        border-gray-300
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-500
                        transition
                    "
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>

            </div>

            <div className="mt-6">

                <Button type="submit">
                    {editingPatient ? "Update Patient" : "Add Patient"}
                </Button>

            </div>

        </form>

    );
};

export default PatientForm;