import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return token
        ? {
            Authorization: `Bearer ${token}`,
        }
        : {};
};

export const getDoctorByEmail = async (email) => {
    if (!email) {
        throw new Error("Doctor email is required.");
    }

    const response = await axios.get(
        `${API_BASE_URL}/api/doctors/email/${encodeURIComponent(email)}`,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};

export const updateDoctorProfile = async (doctorId, doctorData) => {
    if (!doctorId) {
        throw new Error("Doctor ID is required.");
    }

    const response = await axios.put(
        `${API_BASE_URL}/api/doctors/${doctorId}`,
        doctorData,
        {
            headers: {
                ...getAuthHeaders(),
                "Content-Type": "application/json",
            },
        }
    );

    return response.data;
};

export const updateDoctorAvailability = async (
    email,
    availability
) => {
    if (!email) {
        throw new Error("Doctor email is required.");
    }

    const normalizedAvailability = availability
        ?.trim()
        .toUpperCase();

    if (
        normalizedAvailability !== "AVAILABLE" &&
        normalizedAvailability !== "UNAVAILABLE"
    ) {
        throw new Error(
            "Availability must be AVAILABLE or UNAVAILABLE."
        );
    }

    const response = await axios.put(
        `${API_BASE_URL}/api/doctors/email/${encodeURIComponent(
            email
        )}/availability`,
        normalizedAvailability,
        {
            headers: {
                ...getAuthHeaders(),
                "Content-Type": "text/plain",
            },
        }
    );

    return response.data;
};

export const getDoctorAppointments = async (email) => {
    if (!email) {
        throw new Error("Doctor email is required.");
    }

    const response = await axios.get(
        `${API_BASE_URL}/api/appointments/doctor/${encodeURIComponent(
            email
        )}`,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};


export const acceptDoctorAppointment = async (
    appointmentId
) => {
    const response = await axios.put(
        `${API_BASE_URL}/api/appointments/${appointmentId}/accept`,
        {},
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};

export const rejectDoctorAppointment = async (
    appointmentId
) => {
    const response = await axios.put(
        `${API_BASE_URL}/api/appointments/${appointmentId}/reject`,
        {},
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};

export const completeDoctorAppointment = async (
    appointmentId
) => {
    const response = await axios.put(
        `${API_BASE_URL}/api/appointments/${appointmentId}/complete`,
        {},
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};


const doctorService = {
    getDoctorByEmail,
    updateDoctorProfile,
    updateDoctorAvailability,
    getDoctorAppointments,
    acceptDoctorAppointment,
    rejectDoctorAppointment,
    completeDoctorAppointment
};

export default doctorService;