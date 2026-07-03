import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";

const data = [
    { month: "Jan", patients: 10 },
    { month: "Feb", patients: 18 },
    { month: "Mar", patients: 25 },
    { month: "Apr", patients: 32 },
    { month: "May", patients: 41 },
    { month: "Jun", patients: 55 }
];

const PatientsChart = () => {

    return (

        <div className="bg-white rounded-2xl shadow-md p-6">

            <h2 className="text-2xl font-semibold mb-6">

                Patient Growth

            </h2>

            <ResponsiveContainer
                width="100%"
                height={300}
            >

                <LineChart data={data}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="patients"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ r: 6 }}
                        activeDot={{ r: 8 }}
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>

    );

};

export default PatientsChart;