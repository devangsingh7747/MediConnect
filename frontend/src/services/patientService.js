import api from "./api";

export const getCurrentPatient = async () => {
    const response = await api.get(
        "/patients/me"
    );

    return response.data;
};

export const updateCurrentPatient = async (
    patientData
) => {
    const response = await api.put(
        "/patients/me",
        patientData
    );

    return response.data;
};

const patientService = {
    getCurrentPatient,
    updateCurrentPatient,
};

export default patientService;