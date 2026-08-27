import { useEffect, useState } from "react";
import { fetchProperties } from "../api/client";

export function useProperties(filters, page, sortBy, sortOrder, limit = 20) {
    const [properties, setProperties] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadProperties() {
            try {
                setLoading(true);
                setError("");

                const params = {
                    ...filters,
                    limit,
                    offset: (page - 1) * limit
                };

                if (sortBy) {
                    params.sortBy = sortBy;
                    params.sortOrder = sortOrder;
                }

                const data = await fetchProperties(params);

                if (!data || !data.results) {
                    throw new Error("Cannot connect to backend.");
                }

                setProperties(data.results);
                setTotal(data.total);
            } catch (err) {
                setError(err.message);
                setProperties([]);
                setTotal(0);
            } finally {
                setLoading(false);
            }
        }
        loadProperties();
    }, [page, filters, sortBy, sortOrder, limit]);

    return { properties, total, loading, error };
}