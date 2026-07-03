const StatsCard = ({ title, value, icon, color, onClick }) => {

    return (

        <div
            onClick={onClick}
            className="
                cursor-pointer
                bg-white
                rounded-2xl
                shadow-md
                hover:shadow-xl
                hover:-translate-y-1
                transition-all
                duration-300
                p-6
                flex
                justify-between
                items-center
            "
        >

            <div>

                <p className="text-gray-500 text-sm">
                    {title}
                </p>

                <h2 className={`text-4xl font-bold mt-2 ${color}`}>
                    {value}
                </h2>

                <p className="text-xs text-green-600 mt-3 font-medium">
                    ↑ Updated Live
                </p>

            </div>

            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl">

                {icon}

            </div>

        </div>

    );

};

export default StatsCard;