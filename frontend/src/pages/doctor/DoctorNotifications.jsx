import DoctorLayout from "../../components/doctor/DoctorLayout";

const DoctorNotifications = () => {
    return (
        <DoctorLayout>
            <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h1 className="text-3xl font-bold text-slate-900">
                    Doctor Notifications
                </h1>

                <p className="mt-3 text-slate-600">
                    Doctor notifications will appear here.
                </p>
            </div>
        </DoctorLayout>
    );
};

export default DoctorNotifications;