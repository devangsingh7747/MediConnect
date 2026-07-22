import DoctorLayout from "../../components/doctor/DoctorLayout";

const DoctorAppointments = () => {
    return (
        <DoctorLayout>
            <div className="rounded-2xl bg-white p-10 shadow-sm">
                <h1 className="text-3xl font-bold text-slate-900">
                    Doctor Appointments
                </h1>

                <p className="mt-3 text-slate-600">
                    This page will display appointments assigned to the logged-in doctor.
                </p>
            </div>
        </DoctorLayout>
    );
};

export default DoctorAppointments;