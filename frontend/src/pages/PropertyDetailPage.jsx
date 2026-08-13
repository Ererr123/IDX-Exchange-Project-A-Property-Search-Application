import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPropertyDetail, fetchOpenHouses } from "../api/client";
import PropertyImageGallery from "../components/PropertyImageGallery";
import PropertyMap from "../components/PropertyMap";
import OpenHouseList from "../components/OpenHouseList";
import "./PropertyDetailPage.css";

export default function PropertyDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [property, setProperty] = useState(null);
    const [openHouses, setOpenHouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadDetail() {
            try {
                setLoading(true);
                const [propertyData, openHouseData] = await Promise.all([
                    fetchPropertyDetail(id),
                    fetchOpenHouses(id)
                ]);
                setProperty(propertyData);
                setOpenHouses(openHouseData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="status-container">
                <h2>Loading property...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="status-container">
                <h2>{error}</h2>
                <button onClick={() => navigate("/")}>Back to Listings</button>
            </div>
        );
    }

    return (
        <div className="detail-page">
            <button className="back-button" onClick={() => navigate("/")}>
                ← Back to Listings
            </button>

            <div className="detail-header">
                <h1>${Number(property.L_SystemPrice).toLocaleString()}</h1>
                <p className="detail-address">{property.L_Address}</p>
                <p className="detail-city">
                    {property.L_City}, {property.L_State} {property.L_Zip}
                </p>
            </div>

            <PropertyImageGallery photoString={property.L_Photos} />

            {/* stats row */}
            <div className="detail-stats">
                <div className="stat">
                    <strong>{property.L_Keyword2}</strong>
                    <span>Beds</span>
                </div>
                <div className="stat">
                    <strong>{property.LM_Dec_3}</strong>
                    <span>Baths</span>
                </div>
                <div className="stat">
                    <strong>{property.LM_Int2_3?.toLocaleString()}</strong>
                    <span>Sqft</span>
                </div>
                {property.YearBuilt && (
                    <div className="stat">
                        <strong>{property.YearBuilt}</strong>
                        <span>Year Built</span>
                    </div>
                )}
                {property.LotSizeAcres && (
                    <div className="stat">
                        <strong>{property.LotSizeAcres}</strong>
                        <span>Lot Acres</span>
                    </div>
                )}
            </div>

            {/* description */}
            {property.L_Remarks && (
                <div className="detail-description">
                    <h2>Description</h2>
                    <p>{property.L_Remarks}</p>
                </div>
            )}

            <PropertyMap
                lat={property.LMD_MP_Latitude}
                lng={property.LMD_MP_Longitude}
                address={property.L_Address}
            />

            <OpenHouseList openHouses={openHouses} />
        </div>
    );
}