import { useNavigate } from "react-router-dom";
import PropertyImageCarousel from "./PropertyImageCarousel";
import "./PropertyCard.css";

export default function PropertyCard({ property }) {
    const navigate = useNavigate();

    return (
        <div className="property-card">
            <PropertyImageCarousel
                photoString={property.L_Photos}
                listingId={property.L_ListingID}
            />
            <div
                className="property-content"
                onClick={() => navigate(`/property/${property.L_ListingID}`)}
                style={{ cursor: "pointer" }}
            >
                <h2>
                    ${Number(property.L_SystemPrice).toLocaleString()}
                </h2>
                <p className="address">{property.L_Address}</p>
                <p>
                    {property.L_City}, {property.L_State}
                </p>
                <div className="property-details">
                    <div>
                        <strong>{property.L_Keyword2}</strong>
                        <p>Beds</p>
                    </div>
                    <div>
                        <strong>{property.LM_Dec_3}</strong>
                        <p>Baths</p>
                    </div>
                    <div>
                        <strong>{property.LM_Int2_3}</strong>
                        <p>Sqft</p>
                    </div>
                </div>
            </div>
        </div>
    );
}