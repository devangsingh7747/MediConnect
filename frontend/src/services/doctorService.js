import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8080";

const getAuthHeaders = () => {
    const token =
        localStorage.getItem("token");

    return token
        ? {
              Authorization: `Bearer ${token}`,
          }
        : {};
};

export const getDoctorByEmail = async () => {
    const response = await axios.get(
        `${API_BASE_URL}/api/doctors/me`,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};

export const updateDoctorProfile = async (
    doctorId,
    doctorData
) => {
    void doctorId;

    const response = await axios.put(
        `${API_BASE_URL}/api/doctors/me`,
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

export const updateDoctorAvailability =
    async (email, availability) => {

        /*
         * Email is retained only for backward compatibility.
         * The backend now identifies the doctor from JWT.
         */
        void email;

        const normalizedAvailability =
            availability
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
            `${API_BASE_URL}/api/doctors/me/availability`,
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

export const getDoctorAppointments =
    async (email) => {
        if (!email) {
            throw new Error(
                "Doctor email is required."
            );
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

export const acceptDoctorAppointment =
    async (appointmentId) => {
        if (!appointmentId) {
            throw new Error(
                "Appointment ID is required."
            );
        }

        const response = await axios.put(
            `${API_BASE_URL}/api/appointments/${appointmentId}/accept`,
            {},
            {
                headers: getAuthHeaders(),
            }
        );

        return response.data;
    };

export const rejectDoctorAppointment =
    async (appointmentId) => {
        if (!appointmentId) {
            throw new Error(
                "Appointment ID is required."
            );
        }

        const response = await axios.put(
            `${API_BASE_URL}/api/appointments/${appointmentId}/reject`,
            {},
            {
                headers: getAuthHeaders(),
            }
        );

        return response.data;
    };

export const completeDoctorAppointment =
    async (appointmentId) => {
        if (!appointmentId) {
            throw new Error(
                "Appointment ID is required."
            );
        }

        const response = await axios.put(
            `${API_BASE_URL}/api/appointments/${appointmentId}/complete`,
            {},
            {
                headers: getAuthHeaders(),
            }
        );

        return response.data;
    };

/*
 * Latest ten notifications for the header dropdown.
 */
export const getLatestDoctorNotifications =
    async (email) => {
        if (!email) {
            throw new Error(
                "Doctor email is required."
            );
        }

        const response = await axios.get(
            `${API_BASE_URL}/api/notifications/email/${encodeURIComponent(
                email
            )}/latest`,
            {
                headers: getAuthHeaders(),
            }
        );

        return response.data;
    };

/*
 * Complete notification history.
 */
export const getAllDoctorNotifications =
    async (email) => {
        if (!email) {
            throw new Error(
                "Doctor email is required."
            );
        }

        const response = await axios.get(
            `${API_BASE_URL}/api/notifications/email/${encodeURIComponent(
                email
            )}`,
            {
                headers: getAuthHeaders(),
            }
        );

        return response.data;
    };

/*
 * Unread notification count for the bell badge.
 */
export const getDoctorUnreadNotificationCount =
    async (email) => {
        if (!email) {
            throw new Error(
                "Doctor email is required."
            );
        }

        const response = await axios.get(
            `${API_BASE_URL}/api/notifications/email/${encodeURIComponent(
                email
            )}/unread-count`,
            {
                headers: getAuthHeaders(),
            }
        );

        return response.data;
    };

/*
 * Mark a single notification as read.
 */
export const markDoctorNotificationAsRead =
    async (notificationId) => {
        if (!notificationId) {
            throw new Error(
                "Notification ID is required."
            );
        }

        const response = await axios.put(
            `${API_BASE_URL}/api/notifications/${notificationId}/read`,
            {},
            {
                headers: getAuthHeaders(),
            }
        );

        return response.data;
    };

/*
 * Mark every doctor notification as read.
 */
export const markAllDoctorNotificationsAsRead =
    async (email) => {
        if (!email) {
            throw new Error(
                "Doctor email is required."
            );
        }

        const response = await axios.put(
            `${API_BASE_URL}/api/notifications/email/${encodeURIComponent(
                email
            )}/read-all`,
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
    completeDoctorAppointment,
    getLatestDoctorNotifications,
    getAllDoctorNotifications,
    getDoctorUnreadNotificationCount,
    markDoctorNotificationAsRead,
    markAllDoctorNotificationsAsRead,
};

export default doctorService;