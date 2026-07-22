import {
    useEffect,
    useState,
} from "react";

import {
    BriefcaseMedical,
    Building2,
    LoaderCircle,
    Mail,
    Phone,
    Save,
    Stethoscope,
    UserRound,
} from "lucide-react";

import { toast } from "react-toastify";

import DoctorLayout from "../../components/doctor/DoctorLayout";
import {
    updateDoctorProfile,
} from "../../services/doctorService";

const specializationOptions = [
    "General Physician",
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Orthopedic",
    "Pediatrician",
    "Psychiatrist",
    "Gynecologist",
    "ENT Specialist",
    "Dentist",
];

const createFormDataFromDoctor = (doctor) => ({
    firstName: doctor?.firstName || "",
    lastName: doctor?.lastName || "",
    email: doctor?.email || "",
    specialization: doctor?.specialization || "",
    phone: doctor?.phone || "",
    experience:
        doctor?.experience !== null &&
        doctor?.experience !== undefined
            ? String(doctor.experience)
            : "",
    hospital: doctor?.hospital || "",
    availability:
        doctor?.availability || "UNAVAILABLE",
});

const DoctorProfileContent = ({
    doctor,
    setDoctor,
    doctorLoading,
    doctorError,
    reloadDoctor,
}) => {
    const [formData, setFormData] = useState(
        createFormDataFromDoctor(doctor)
    );

    const [saving, setSaving] = useState(false);

    /*
     * Whenever DoctorHeader updates the shared doctor state,
     * this effect updates the profile form and status badge.
     */
    useEffect(() => {
        if (doctor) {
            setFormData(
                createFormDataFromDoctor(doctor)
            );
        }
    }, [doctor]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        if (!formData.firstName.trim()) {
            toast.warning("First name is required.");
            return false;
        }

        if (!formData.lastName.trim()) {
            toast.warning("Last name is required.");
            return false;
        }

        if (!formData.specialization.trim()) {
            toast.warning(
                "Specialization is required."
            );
            return false;
        }

        if (!formData.phone.trim()) {
            toast.warning(
                "Phone number is required."
            );
            return false;
        }

        const phonePattern = /^[6-9]\d{9}$/;

        if (
            !phonePattern.test(
                formData.phone.trim()
            )
        ) {
            toast.warning(
                "Enter a valid 10-digit Indian phone number."
            );
            return false;
        }

        if (
            formData.experience === "" ||
            Number(formData.experience) < 0
        ) {
            toast.warning(
                "Experience must be zero or greater."
            );
            return false;
        }

        if (!formData.hospital.trim()) {
            toast.warning(
                "Hospital or clinic name is required."
            );
            return false;
        }

        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!doctor?.id) {
            toast.error(
                "Doctor ID was not found."
            );
            return;
        }

        const payload = {
            firstName:
                formData.firstName.trim(),
            lastName:
                formData.lastName.trim(),
            email: formData.email,
            specialization:
                formData.specialization.trim(),
            phone:
                formData.phone.trim(),
            experience:
                Number(formData.experience),
            hospital:
                formData.hospital.trim(),

            /*
             * Keep the latest shared availability.
             * This prevents profile saving from restoring
             * an older availability value.
             */
            availability:
                doctor?.availability ||
                formData.availability ||
                "UNAVAILABLE",
        };

        try {
            setSaving(true);

            const updatedDoctor =
                await updateDoctorProfile(
                    doctor.id,
                    payload
                );

            /*
             * Update the shared DoctorLayout state.
             * Header, profile badge and dashboard stay synchronized.
             */
            setDoctor(updatedDoctor);

            toast.success(
                "Doctor profile updated successfully."
            );
        } catch (error) {
            console.error(
                "Failed to update doctor profile:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                    error?.response?.data ||
                    "Unable to update doctor profile."
            );
        } finally {
            setSaving(false);
        }
    };

    if (doctorLoading) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center">
                <LoaderCircle className="h-10 w-10 animate-spin text-blue-600" />

                <p className="mt-4 font-medium text-slate-500">
                    Loading doctor profile...
                </p>
            </div>
        );
    }

    if (doctorError || !doctor) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900">
                        Profile could not be loaded
                    </h2>

                    <p className="mt-2 text-sm text-slate-600">
                        {doctorError ||
                            "Doctor information was not found."}
                    </p>

                    <button
                        type="button"
                        onClick={reloadDoctor}
                        className="mt-6 cursor-pointer rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const isAvailable =
        doctor?.availability?.toUpperCase() ===
        "AVAILABLE";

    return (
        <div className="w-full space-y-6">
            <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-7 text-white shadow-lg shadow-blue-100">
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                    <div>
                        <p className="text-sm font-semibold text-blue-100">
                            Professional Profile
                        </p>

                        <h1 className="mt-1 text-3xl font-bold">
                            Manage Doctor Profile
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50">
                            Keep your professional
                            information accurate so patients
                            can be assigned to you correctly.
                        </p>
                    </div>

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                        <Stethoscope size={31} />
                    </div>
                </div>
            </section>

            <form
                onSubmit={handleSubmit}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8"
            >
                <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            Personal and Professional
                            Details
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Fields marked as required must
                            be completed before becoming
                            available.
                        </p>
                    </div>

                    <div
                        className={`w-fit rounded-full px-4 py-2 text-sm font-bold ${
                            isAvailable
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                        }`}
                    >
                        {isAvailable
                            ? "Available"
                            : "Unavailable"}
                    </div>
                </div>

                <div className="mt-7 grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            First Name
                        </label>

                        <div className="relative">
                            <UserRound
                                size={19}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                name="firstName"
                                value={
                                    formData.firstName
                                }
                                onChange={
                                    handleInputChange
                                }
                                placeholder="Enter first name"
                                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Last Name
                        </label>

                        <div className="relative">
                            <UserRound
                                size={19}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                name="lastName"
                                value={
                                    formData.lastName
                                }
                                onChange={
                                    handleInputChange
                                }
                                placeholder="Enter last name"
                                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Email Address
                        </label>

                        <div className="relative">
                            <Mail
                                size={19}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="email"
                                value={
                                    formData.email
                                }
                                readOnly
                                className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 py-3 pl-11 pr-4 text-slate-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Phone Number
                        </label>

                        <div className="relative">
                            <Phone
                                size={19}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="tel"
                                name="phone"
                                value={
                                    formData.phone
                                }
                                onChange={
                                    handleInputChange
                                }
                                maxLength={10}
                                placeholder="Enter 10-digit phone number"
                                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Specialization
                        </label>

                        <div className="relative">
                            <Stethoscope
                                size={19}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <select
                                name="specialization"
                                value={
                                    formData.specialization
                                }
                                onChange={
                                    handleInputChange
                                }
                                className="w-full cursor-pointer appearance-none rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            >
                                <option value="">
                                    Select specialization
                                </option>

                                {specializationOptions.map(
                                    (
                                        specialization
                                    ) => (
                                        <option
                                            key={
                                                specialization
                                            }
                                            value={
                                                specialization
                                            }
                                        >
                                            {
                                                specialization
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Years of Experience
                        </label>

                        <div className="relative">
                            <BriefcaseMedical
                                size={19}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="number"
                                name="experience"
                                value={
                                    formData.experience
                                }
                                onChange={
                                    handleInputChange
                                }
                                min="0"
                                max="70"
                                placeholder="Enter experience"
                                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Hospital or Clinic
                        </label>

                        <div className="relative">
                            <Building2
                                size={19}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                name="hospital"
                                value={
                                    formData.hospital
                                }
                                onChange={
                                    handleInputChange
                                }
                                placeholder="Enter hospital or clinic name"
                                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center">
                    <p className="max-w-2xl text-sm leading-6 text-slate-500">
                        After saving the required details,
                        use the availability toggle in the
                        header to become available for
                        automatic appointment assignment.
                    </p>

                    <button
                        type="submit"
                        disabled={saving}
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving ? (
                            <>
                                <LoaderCircle
                                    size={19}
                                    className="animate-spin"
                                />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={19} />
                                Save Profile
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

const DoctorProfile = () => {
    return (
        <DoctorLayout>
            {({
                doctor,
                setDoctor,
                doctorLoading,
                doctorError,
                reloadDoctor,
            }) => (
                <DoctorProfileContent
                    doctor={doctor}
                    setDoctor={setDoctor}
                    doctorLoading={
                        doctorLoading
                    }
                    doctorError={doctorError}
                    reloadDoctor={reloadDoctor}
                />
            )}
        </DoctorLayout>
    );
};

export default DoctorProfile;