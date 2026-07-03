import { useState, useEffect } from "react";
import Input from "../common/Input";
import Button from "../common/Button";

const DoctorForm = ({ onSubmit, editingDoctor }) => {

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        specialization: "",
        email: "",
        phone: "",
        experience: "",
        hospital: "",
        availability: ""
    });

    useEffect(() => {

        if (editingDoctor) {

            setFormData({
                firstName: editingDoctor.firstName || "",
                lastName: editingDoctor.lastName || "",
                specialization: editingDoctor.specialization || "",
                email: editingDoctor.email || "",
                phone: editingDoctor.phone || "",
                experience: editingDoctor.experience || "",
                hospital: editingDoctor.hospital || "",
                availability: editingDoctor.availability || ""
            });

        }

    }, [editingDoctor]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData(prev => ({
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
            specialization: "",
            email: "",
            phone: "",
            experience: "",
            hospital: "",
            availability: ""
        });

    };

    return (

        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow p-6 mb-8"
        >

            <h2 className="text-2xl font-semibold mb-5">
                Doctor Details
            </h2>

            <div className="grid grid-cols-2 gap-4">

                <Input
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />

                <Input
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />

                <Input
                    name="specialization"
                    placeholder="Specialization"
                    value={formData.specialization}
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
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />

                <Input
                    name="experience"
                    type="number"
                    placeholder="Experience (Years)"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                />

                <Input
                    name="hospital"
                    placeholder="Hospital"
                    value={formData.hospital}
                    onChange={handleChange}
                    required
                />

                <Input
                    name="availability"
                    placeholder="Availability"
                    value={formData.availability}
                    onChange={handleChange}
                    required
                />

            </div>

            <div className="mt-6">

                <Button type="submit">
                    {editingDoctor ? "Update Doctor" : "Add Doctor"}
                </Button>

            </div>

        </form>

    );

};

export default DoctorForm;