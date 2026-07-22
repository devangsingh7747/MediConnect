import { toast } from "react-toastify";

export const exportAppointmentsToCSV = (appointments) => {

    if (appointments.length === 0) {

        toast.error("No appointments available to export.");

        return;

    }

    const headers = [
        "ID",
        "Patient",
        "Problem",
        "Doctor",
        "Date",
        "Time",
        "Status"
    ];

    const rows = appointments.map((appointment) => [

        appointment.id,
        appointment.patientName,
        appointment.problem,
        appointment.doctorName,
        appointment.appointmentDate,
        appointment.appointmentTime,
        appointment.status

    ]);

    const csvContent = [

        headers.join(","),
        ...rows.map(row => row.join(","))

    ].join("\n");

    const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "appointments.csv";

    link.click();

    toast.success("Appointments exported successfully!");

};