import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {

    return (

        <div className="bg-gray-100 min-h-screen">

            <div className="fixed left-0 top-0 h-screen w-64">
                <Sidebar />
            </div>

            <main className="ml-64 p-8">

                <Header />
                {children}
                
            </main>

        </div>

    );

};

export default Layout;