import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaBirthdayCake,
    FaVenusMars,
    FaEdit,
    FaSave,
    FaTimes
} from "react-icons/fa";

import PatientLayout from "../../components/patient/PatientLayout";
import api from "../../services/api";

const PatientProfile = () => {

    const loggedInUser = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const [profile, setProfile] = useState({

        firstName: "",
        lastName: "",
        email: loggedInUser.email || "",
        phone: "",
        age: "",
        gender: ""

    });

    const [originalProfile, setOriginalProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const response = await api.get(
                    `/patients/email/${loggedInUser.email}`
                );

                const patient = response.data;

                const patientProfile = {

                    firstName: patient.firstName || "",
                    lastName: patient.lastName || "",
                    email: patient.email || loggedInUser.email || "",
                    phone: patient.phone || "",
                    age: patient.age ?? "",
                    gender: patient.gender || ""

                };

                setProfile(patientProfile);
                setOriginalProfile(patientProfile);

            } catch (error) {

                console.error(
                    "Failed to load patient profile:",
                    error
                );

                toast.error("Unable to load your profile.");

            } finally {

                setLoading(false);

            }

        };

        if (loggedInUser.email) {

            fetchProfile();

        } else {

            setLoading(false);

            toast.error("Logged-in user information is missing.");

        }

    }, [loggedInUser.email]);

    const handleChange = (event) => {

        const { name, value } = event.target;

        setProfile((previous) => ({

            ...previous,
            [name]: value

        }));

    };

    const handleEdit = () => {

        setEditing(true);

    };

    const handleCancel = () => {

        if (originalProfile) {

            setProfile(originalProfile);

        }

        setEditing(false);

    };

    const handleSave = async (event) => {

        event.preventDefault();

        if (!profile.firstName.trim()) {

            toast.error("First name is required.");

            return;

        }

        if (!profile.lastName.trim()) {

            toast.error("Last name is required.");

            return;

        }

        if (!profile.phone.trim()) {

            toast.error("Phone number is required.");

            return;

        }

        if (!/^\d{10}$/.test(profile.phone.trim())) {

            toast.error(
                "Phone number must contain exactly 10 digits."
            );

            return;

        }

        const numericAge = Number(profile.age);

        if (
            !numericAge ||
            numericAge < 1 ||
            numericAge > 120
        ) {

            toast.error(
                "Please enter a valid age between 1 and 120."
            );

            return;

        }

        if (!profile.gender) {

            toast.error("Please select your gender.");

            return;

        }

        try {

            setSaving(true);

            const response = await api.put(
                `/patients/email/${loggedInUser.email}`,
                {
                    firstName: profile.firstName.trim(),
                    lastName: profile.lastName.trim(),
                    phone: profile.phone.trim(),
                    age: numericAge,
                    gender: profile.gender
                }
            );

            const updatedPatient = response.data;

            const updatedProfile = {

                firstName: updatedPatient.firstName || "",
                lastName: updatedPatient.lastName || "",
                email: updatedPatient.email || loggedInUser.email,
                phone: updatedPatient.phone || "",
                age: updatedPatient.age ?? "",
                gender: updatedPatient.gender || ""

            };

            setProfile(updatedProfile);
            setOriginalProfile(updatedProfile);
            setEditing(false);

            const updatedUser = {

                ...loggedInUser,
                fullName: `${updatedProfile.firstName} ${updatedProfile.lastName}`.trim()

            };

            localStorage.setItem(
                "user",
                JSON.stringify(updatedUser)
            );

            toast.success("Profile updated successfully.");

        } catch (error) {

            console.error(
                "Failed to update patient profile:",
                error
            );

            let message = "Unable to update your profile.";

            if (
                typeof error.response?.data === "string" &&
                error.response.data.trim() !== ""
            ) {

                message = error.response.data;

            } else if (error.response?.data?.message) {

                message = error.response.data.message;

            }

            toast.error(message);

        } finally {

            setSaving(false);

        }

    };

    if (loading) {

        return (

            <PatientLayout>

                <div className="bg-white rounded-2xl shadow p-10 text-center">

                    <p className="text-gray-500">

                        Loading your profile...

                    </p>

                </div>

            </PatientLayout>

        );

    }

    return (

        <PatientLayout>

            <div className="space-y-6">

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">

                        My Profile

                    </h1>

                    <p className="text-gray-500 mt-2">

                        View and manage your personal information.

                    </p>

                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                    <div className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-2xl shadow p-8">

                        <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto">

                            <FaUser className="text-5xl" />

                        </div>

                        <h2 className="text-2xl font-bold text-center mt-5">

                            {profile.firstName || "Patient"}{" "}
                            {profile.lastName}

                        </h2>

                        <p className="text-center text-blue-100 mt-2">

                            Patient

                        </p>

                        <div className="mt-8 space-y-4">

                            <div className="bg-white/15 rounded-xl p-4">

                                <p className="text-sm text-blue-100">

                                    Profile Status

                                </p>

                                <p className="font-semibold mt-1">

                                    {profile.phone &&
                                    profile.age &&
                                    profile.gender
                                        ? "Completed"
                                        : "Incomplete"
                                    }

                                </p>

                            </div>

                            <div className="bg-white/15 rounded-xl p-4">

                                <p className="text-sm text-blue-100">

                                    Email

                                </p>

                                <p className="font-semibold mt-1 break-all">

                                    {profile.email}

                                </p>

                            </div>

                        </div>

                    </div>

                    <div className="xl:col-span-2 bg-white rounded-2xl shadow p-8">

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

                            <div>

                                <h2 className="text-2xl font-bold text-gray-800">

                                    Personal Information

                                </h2>

                                <p className="text-sm text-gray-500 mt-1">

                                    Keep your profile details accurate and up to date.

                                </p>

                            </div>

                            {!editing && (

                                <button
                                    type="button"
                                    onClick={handleEdit}
                                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl transition cursor-pointer"
                                >

                                    <FaEdit />

                                    Edit Profile

                                </button>

                            )}

                        </div>

                        <form onSubmit={handleSave}>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">

                                        First Name

                                    </label>

                                    <div className="relative">

                                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                        <input
                                            type="text"
                                            name="firstName"
                                            value={profile.firstName}
                                            onChange={handleChange}
                                            disabled={!editing}
                                            className="
                                                w-full
                                                border
                                                rounded-xl
                                                pl-11
                                                pr-4
                                                py-3
                                                focus:outline-none
                                                focus:ring-2
                                                focus:ring-blue-500
                                                disabled:bg-gray-100
                                                disabled:text-gray-600
                                            "
                                        />

                                    </div>

                                </div>

                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">

                                        Last Name

                                    </label>

                                    <div className="relative">

                                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                        <input
                                            type="text"
                                            name="lastName"
                                            value={profile.lastName}
                                            onChange={handleChange}
                                            disabled={!editing}
                                            className="
                                                w-full
                                                border
                                                rounded-xl
                                                pl-11
                                                pr-4
                                                py-3
                                                focus:outline-none
                                                focus:ring-2
                                                focus:ring-blue-500
                                                disabled:bg-gray-100
                                                disabled:text-gray-600
                                            "
                                        />

                                    </div>

                                </div>

                                <div className="md:col-span-2">

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">

                                        Email Address

                                    </label>

                                    <div className="relative">

                                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                        <input
                                            type="email"
                                            value={profile.email}
                                            disabled
                                            className="w-full border rounded-xl pl-11 pr-4 py-3 bg-gray-100 text-gray-600 cursor-not-allowed"
                                        />

                                    </div>

                                    <p className="text-xs text-gray-500 mt-2">

                                        Email cannot currently be changed because it connects your account, profile, and appointments.

                                    </p>

                                </div>

                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">

                                        Phone Number

                                    </label>

                                    <div className="relative">

                                        <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profile.phone}
                                            onChange={handleChange}
                                            disabled={!editing}
                                            maxLength={10}
                                            placeholder="Enter 10-digit phone number"
                                            className="
                                                w-full
                                                border
                                                rounded-xl
                                                pl-11
                                                pr-4
                                                py-3
                                                focus:outline-none
                                                focus:ring-2
                                                focus:ring-blue-500
                                                disabled:bg-gray-100
                                                disabled:text-gray-600
                                            "
                                        />

                                    </div>

                                </div>

                                <div>

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">

                                        Age

                                    </label>

                                    <div className="relative">

                                        <FaBirthdayCake className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                        <input
                                            type="number"
                                            name="age"
                                            value={profile.age}
                                            onChange={handleChange}
                                            disabled={!editing}
                                            min="1"
                                            max="120"
                                            placeholder="Enter age"
                                            className="
                                                w-full
                                                border
                                                rounded-xl
                                                pl-11
                                                pr-4
                                                py-3
                                                focus:outline-none
                                                focus:ring-2
                                                focus:ring-blue-500
                                                disabled:bg-gray-100
                                                disabled:text-gray-600
                                            "
                                        />

                                    </div>

                                </div>

                                <div className="md:col-span-2">

                                    <label className="block text-sm font-semibold text-gray-700 mb-2">

                                        Gender

                                    </label>

                                    <div className="relative">

                                        <FaVenusMars className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />

                                        <select
                                            name="gender"
                                            value={profile.gender}
                                            onChange={handleChange}
                                            disabled={!editing}
                                            className="
                                                w-full
                                                border
                                                rounded-xl
                                                pl-11
                                                pr-4
                                                py-3
                                                focus:outline-none
                                                focus:ring-2
                                                focus:ring-blue-500
                                                disabled:bg-gray-100
                                                disabled:text-gray-600
                                            "
                                        >

                                            <option value="">

                                                Select Gender

                                            </option>

                                            <option value="Male">

                                                Male

                                            </option>

                                            <option value="Female">

                                                Female

                                            </option>

                                            <option value="Other">

                                                Other

                                            </option>

                                        </select>

                                    </div>

                                </div>

                            </div>

                            {editing && (

                                <div className="flex flex-col sm:flex-row gap-3 mt-8">

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="inline-flex items-center justify-center gap-2 flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition cursor-pointer disabled:cursor-not-allowed"
                                    >

                                        <FaSave />

                                        {saving
                                            ? "Saving..."
                                            : "Save Changes"
                                        }

                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        disabled={saving}
                                        className="inline-flex items-center justify-center gap-2 sm:w-44 border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl transition cursor-pointer disabled:cursor-not-allowed"
                                    >

                                        <FaTimes />

                                        Cancel

                                    </button>

                                </div>

                            )}

                        </form>

                    </div>

                </div>

            </div>

        </PatientLayout>

    );

};

export default PatientProfile;