import { useEffect, useState } from "react";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";

import api from "../../services/api";

const COLORS = [
    "#22c55e",
    "#f59e0b",
    "#ef4444"
];

const AppointmentPieChart = () => {

    const [data, setData] = useState([]);

    const fetchAppointmentStatus = async () => {

        try {

            const response = await api.get(
                "/dashboard/appointment-status"
            );

            setData([
                {
                    name: "Completed",
                    value: response.data.completed
                },
                {
                    name: "Pending",
                    value: response.data.pending
                },
                {
                    name: "Cancelled",
                    value: response.data.cancelled
                }
            ]);

        } catch (error) {

            console.error(error);

        }

    };
    
    useEffect(() => {

        fetchAppointmentStatus();

    }, []);


    return (

        <div className="bg-white rounded-2xl shadow-md p-6">

            <h2 className="text-2xl font-semibold mb-6">
                Appointment Status
            </h2>

            <ResponsiveContainer
                width="100%"
                height={300}
            >

                <PieChart>

                    <Pie
                        data={data}
                        dataKey="value"
                        outerRadius={100}
                        label
                    >

                        {data.map((entry, index) => (

                            <Cell
                                key={index}
                                fill={COLORS[index]}
                            />

                        ))}

                    </Pie>

                    <Tooltip />

                    <Legend />

                </PieChart>

            </ResponsiveContainer>

        </div>

    );

};

export default AppointmentPieChart;