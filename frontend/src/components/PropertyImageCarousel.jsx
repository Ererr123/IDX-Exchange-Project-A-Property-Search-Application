import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PropertyImageCarousel.css";

// parse photos from L_Photos json string
function parsePhotos(photoString) {
    if (!photoString) return [];
    try {
        const photos = JSON.parse(photoString);
        return Array.isArray(photos) ? photos : [];
    } catch {
        return [];
    }
}

export default function PropertyImageCarousel({ photoString, listingId }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    const photos = parsePhotos(photoString);

    if (photos.length === 0) {
        return (
            <img
                className="carousel-image"
                src="https://placehold.co/400x250?text=No+Photo"
                alt="No photos available"
                onClick={() => navigate(`/property/${listingId}`)}
                style={{ cursor: "pointer" }}
            />
        );
    }

    // stop propagation so arrows don't navigate to detail page
    function handlePrev(e) {
        e.stopPropagation();
        setCurrentIndex((i) => (i > 0 ? i - 1 : photos.length - 1));
    }

    function handleNext(e) {
        e.stopPropagation();
        setCurrentIndex((i) => (i < photos.length - 1 ? i + 1 : 0));
    }

    return (
        <div
            className="carousel-container"
            onClick={() => navigate(`/property/${listingId}`)}
            style={{ cursor: "pointer" }}
        >
            <img
                className="carousel-image"
                src={photos[currentIndex]}
                alt={`Property ${currentIndex + 1}`}
            />

            {photos.length > 1 && (
                <>
                    <button className="carousel-arrow left" onClick={handlePrev}>
                        ‹
                    </button>
                    <button className="carousel-arrow right" onClick={handleNext}>
                        ›
                    </button>
                    <span className="carousel-counter">
                        {currentIndex + 1} / {photos.length}
                    </span>
                </>
            )}
        </div>
    );
}