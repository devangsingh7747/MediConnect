import DoctorLayout from "../../components/doctor/DoctorLayout";

const DoctorProfile = () => {
    return (
        <DoctorLayout>
            <div className="rounded-2xl bg-white p-10 shadow-sm">
                <h1 className="text-3xl font-bold text-slate-900">
                    Doctor Profile
                </h1>

                <p className="mt-3 text-slate-600">
                    Doctor profile editing will be implemented in the next step.
                </p>
            </div>
        </DoctorLayout>
    );
};

export default DoctorProfile;