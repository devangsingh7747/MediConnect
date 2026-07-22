import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {

    const token = localStorage.getItem("token");

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    if (!token || !user) {

        return <Navigate to="/" replace />;

    }

    const role = user.role
        ?.replace("ROLE_", "")
        .toUpperCase();

    if (

        allowedRoles &&
        !allowedRoles.includes(role)

    ) {

        switch (role) {

            case "PATIENT":

                return (
                    <Navigate
                        to="/patient/home"
                        replace
                    />
                );

            case "DOCTOR":

                return (
                    <Navigate
                        to="/doctor/home"
                        replace
                    />
                );

            case "ADMIN":

                return (
                    <Navigate
                        to="/home"
                        replace
                    />
                );

            default:

                return (
                    <Navigate
                        to="/"
                        replace
                    />
                );

        }

    }

    return children;

};

export default ProtectedRoute;