import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

const data = [
    {
        name: "Completed",
        value: 12
    },
    {
        name: "Pending",
        value: 4
    },
    {
        name: "Cancelled",
        value: 2
    }
];

const COLORS = [
    "#22c55e",
    "#f59e0b",
    "#ef4444"
];

const AppointmentPieChart = () => {

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
                        nameKey="name"
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