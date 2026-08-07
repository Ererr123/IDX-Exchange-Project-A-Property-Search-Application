import { useEffect, useState } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "../components/PropertyCard";
import PropertyFilters from "../components/PropertyFilters";
import Pagination from "../components/Pagination";
import "./ListingsPage.css";

export default function ListingsPage() {
    const LIMIT = 20;
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({});
    const [properties, setProperties] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // fetch properties from the backend api
        async function loadProperties() {
            try {
                setLoading(true);
                setError("");
                const data = await fetchProperties({
                    ...filters,
                    limit: LIMIT,
                    offset: (page - 1) * LIMIT
                });

                // make sure we got valid data, not an html error page
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
    }, [page, filters]);

    // scroll to top and update page
    function handlePageChange(newPage) {
        window.scrollTo(0, 0);
        setPage(newPage);
    }

    // reset to page 1 when filters change
    function handleSearch(newFilters) {
        setPage(1);
        setFilters(newFilters);
    }

    // show loading state
    if (loading) {
        return (
            <div className="status-container">
                <h2>Loading properties...</h2>
            </div>
        );
    }

    // show error state
    if (error) {
        return (
            <div className="status-container">
                <h2>{error}</h2>
            </div>
        );
    }

    // calculate showing x-y of z
    const showingFrom = total === 0 ? 0 : (page - 1) * LIMIT + 1;
    const showingTo = Math.min(page * LIMIT, total);
    const totalPages = Math.ceil(total / LIMIT);

    return (
        <div className="listings-page">
            <div className="page-header">
                <h1>Property Listings</h1>
                <p>
                    Showing <strong>{showingFrom}-{showingTo}</strong> of{" "}
                    <strong>{total}</strong> properties
                </p>
            </div>

            <PropertyFilters onSearch={handleSearch} />

            {/* no results message */}
            {properties.length === 0 && (
                <div className="status-container">
                    <h2>No properties found matching your filters.</h2>
                </div>
            )}

            <div className="property-grid">
                {properties.map((property) => (
                    <PropertyCard
                        key={property.L_ListingID}
                        property={property}
                    />
                ))}
            </div>

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}