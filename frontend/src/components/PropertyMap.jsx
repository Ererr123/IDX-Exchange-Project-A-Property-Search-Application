import "./PropertyMap.css";

export default function PropertyMap({ lat, lng, address }) {
    // Only render if both coordinates are present
    if (lat == null || lng == null) return null;

    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=15`;
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    return (
        <div className="map-container">
            <h2>Location</h2>

            <iframe
                title={`Map showing ${address || "property location"}`}
                src={mapUrl}
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: "12px" }}
                allowFullScreen
                loading="lazy"
            />

            <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="directions-link"
            >
                Get Directions →
            </a>
        </div>
    );
}