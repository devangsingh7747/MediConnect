import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import DoctorHeader from "./DoctorHeader";
import DoctorSidebar from "./DoctorSidebar";
import { getDoctorByEmail } from "../../services/doctorService";

const getSavedUser = () => {
    try {
        return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
        return null;
    }
};

const DoctorLayout = ({ children }) => {
    const savedUser = useMemo(() => getSavedUser(), []);
    const doctorEmail = savedUser?.email || "";

    const [doctor, setDoctor] = useState(null);
    const [doctorLoading, setDoctorLoading] = useState(true);
    const [doctorError, setDoctorError] = useState("");

    const loadDoctor = useCallback(async () => {
        if (!doctorEmail) {
            setDoctorError(
                "Doctor account information was not found."
            );
            setDoctorLoading(false);
            return;
        }

        try {
            setDoctorLoading(true);
            setDoctorError("");

            const doctorData = await getDoctorByEmail(
                doctorEmail
            );

            setDoctor(doctorData);
        } catch (error) {
            console.error(
                "Failed to load doctor in layout:",
                error
            );

            setDoctorError(
                error?.response?.data?.message ||
                    error?.response?.data ||
                    "Unable to load doctor information."
            );
        } finally {
            setDoctorLoading(false);
        }
    }, [doctorEmail]);

    useEffect(() => {
        loadDoctor();
    }, [loadDoctor]);

    return (
        <div className="min-h-screen bg-slate-50">
            <DoctorSidebar />

            <div className="min-h-screen pl-64">
                <DoctorHeader
                    doctor={doctor}
                    doctorLoading={doctorLoading}
                    onDoctorUpdate={setDoctor}
                />

                <main className="p-6 lg:p-8">
                    {typeof children === "function"
                        ? children({
                                doctor,
                                setDoctor,
                                doctorLoading,
                                doctorError,
                                reloadDoctor: loadDoctor,
                            })
                        : children}
                </main>
            </div>
        </div>
    );
};

export default DoctorLayout;