const EmptyState = ({ title, description }) => {

    return (

        <div className="flex flex-col items-center justify-center py-16">

            <div className="text-7xl mb-4">

                📋

            </div>

            <h2 className="text-2xl font-semibold text-gray-700">

                {title}

            </h2>

            <p className="text-gray-500 mt-2 text-center">

                {description}

            </p>

        </div>

    );

};

export default EmptyState;