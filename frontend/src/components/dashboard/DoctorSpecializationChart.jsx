import { useEffect, useState } from "react";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";

import api from "../../services/api";

const DoctorSpecializationChart = () => {

    const [chartData, setChartData] = useState([]);

    const fetchSpecializations = async () => {

        try {

            const response = await api.get("/dashboard/doctor-specialization");

            const formattedData = Object.entries(response.data).map(

                ([specialization, doctors]) => ({

                    specialization,
                    doctors

                })

            );

            setChartData(formattedData);

        } catch (error) {

            console.error(error);

        }

    };

    useEffect(() => {

        fetchSpecializations();

    }, []);

    return (

        <div className="bg-white rounded-2xl shadow-md p-6">

            <h2 className="text-2xl font-semibold mb-6">

                Doctors by Specialization

            </h2>

            <ResponsiveContainer
                width="100%"
                height={300}
            >

                <BarChart data={chartData}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="specialization" />

                    <YAxis allowDecimals={false} />

                    <Tooltip />

                    <Bar
                        dataKey="doctors"
                        fill="#2563eb"
                        radius={[8, 8, 0, 0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

};

export default DoctorSpecializationChart;