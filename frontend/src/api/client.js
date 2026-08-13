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

export async function fetchPropertyDetail(id) {
    try {
        const response = await api.get(`/properties/${id}`);
        return response.data;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                throw new Error(`Property ${id} not found.`);
            }
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

export async function fetchOpenHouses(id) {
    try {
        const response = await api.get(`/properties/${id}/openhouses`);
        return response.data;
    } catch (error) {
        if (error.response) {
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