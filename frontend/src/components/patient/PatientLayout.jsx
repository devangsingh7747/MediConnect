import PatientSidebar from "./PatientSidebar";
import PatientHeader from "./PatientHeader";

const PatientLayout = ({ children }) => {

    return (

        <div className="min-h-screen bg-gray-100 flex">

            <aside className="w-64 fixed left-0 top-0 h-screen">

                <PatientSidebar />

            </aside>

            <div className="flex-1 ml-64">

                <PatientHeader />

                <main className="p-8">

                    {children}

                </main>

            </div>

        </div>

    );

};

export default PatientLayout;