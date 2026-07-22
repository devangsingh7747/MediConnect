import DoctorLayout from "../../components/doctor/DoctorLayout";

const DoctorNotifications = () => {
    return (
        <DoctorLayout>
            <div className="rounded-2xl bg-white p-10 shadow-sm">
                <h1 className="text-3xl font-bold text-slate-900">
                    Doctor Notifications
                </h1>

                <p className="mt-3 text-slate-600">
                    Your notifications will appear here.
                </p>
            </div>
        </DoctorLayout>
    );
};

export default DoctorNotifications;