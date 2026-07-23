import { useEffect, useState } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "../components/PropertyCard";
import "./ListingsPage.css";

export default function ListingsPage() {
    const LIMIT = 20;
    const [page, setPage] = useState(1);

    const [properties, setProperties] = useState([]);
    const [total, setTotal] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

   useEffect(() => {

    // Fetch properties from the backend API
    async function loadProperties() {
        try {

            setLoading(true);
            const data = await fetchProperties({
                limit: LIMIT,
                offset: (page - 1) * LIMIT
            });

            setProperties(data.results);
            setTotal(data.total);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }
    loadProperties();
    }, [page]);

    // Show loading state
    if (loading) {
        return (
            <div className="status-container">
                <h2>Loading properties...</h2>
            </div>
        );
    }
    // Pagination controls
    <div className="pagination">
        <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
        >
            Previous
        </button>
        <span>
            Page {page} of {Math.ceil(total / LIMIT)}
        </span>
        <button
            disabled={page === Math.ceil(total / LIMIT)}
            onClick={() => setPage(page + 1)}
        >
            Next
        </button>
    </div>

    // Show error state
    if (error) {
        return (
            <div className="status-container">
                <h2>{error}</h2>
            </div>
        );
    }

    // Show properties
    return (
        <div className="listings-page">
            <div className="page-header">
                <h1>Property Listings</h1>
                <p>
                    Showing <strong>{properties.length}</strong> of{" "}
                    <strong>{total}</strong> properties
                </p>
            </div>
            <div className="property-grid">
                {properties.map((property) => (

                    <PropertyCard
                        key={property.L_ListingID}
                        property={property}
                    />
                ))}
            </div>


            <div className="pagination">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Previous
                </button>
                <span>
                    Page {page} of {Math.ceil(total / LIMIT)}
                </span>
                <button
                    disabled={
                        page === Math.ceil(total / LIMIT)
                    }
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}