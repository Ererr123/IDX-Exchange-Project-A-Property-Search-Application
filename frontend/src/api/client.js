import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    timeout: 5000
});

export async function fetchProperties(params = {}) {
    try {
        const response = await api.get("/properties", { params });
        return response.data;
    } catch (error) {
        if (error.response) {
            // 500 from proxy means backend is unreachable
            if (error.response.status === 500) {
                throw new Error("Cannot connect to backend.");
            }
            throw new Error(
                error.response.data?.error || `Server error: ${error.response.status}`
            );
        }
        if (error.request) {
            throw new Error("Cannot connect to backend.");
        }
        throw new Error(error.message);
    }
}