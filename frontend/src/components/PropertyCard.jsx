import "./PropertyCard.css";

// Gets the first photo from L_Photos
function getFirstPhoto(photoString) {

    // Handles null, undefined, empty string
    if (!photoString) {
        return null;
    }

    try {

        const photos = JSON.parse(photoString);
        // Make sure it is actually an array
        if (!Array.isArray(photos)) {
            return null;
        }
        // Make sure array has photos
        if (photos.length === 0) {
            return null;
        }

        return photos[0];

    } catch (error) {
        // Handles malformed JSON
        console.error(
            "Invalid L_Photos JSON:",
            photoString
        );
        return null;
    }

}

export default function PropertyCard({ property }) {


    const image =
        getFirstPhoto(property.L_Photos)
        ||
        "https://via.placeholder.com/400x250?text=No+Photo";

    return (

        <div className="property-card">

            <img
                className="property-image"
                src={image}
                alt="Property"
            />

            <div className="property-content">
                <h2>
                    $
                    {Number(
                        property.L_SystemPrice
                    ).toLocaleString()}
                </h2>
                <p className="address">

                    {property.L_Address}
                </p>
                <p>
                    {property.L_City},{" "}
                    {property.L_State}

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