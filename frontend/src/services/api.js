import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use((config) => {

    console.log("========== REQUEST ==========");
    console.log("URL:", config.url);

    const token = localStorage.getItem("token");

    console.log("Token:", token);

    const publicRoutes = [
        "/users/login",
        "/users/register"
    ];

    const isPublicRoute = publicRoutes.some(route =>
        config.url.includes(route)
    );

    console.log("Public Route:", isPublicRoute);

    if (token && !isPublicRoute) {
        console.log("Adding Authorization Header");
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        console.log("Authorization NOT Added");
    }

    return config;

});

export default api;