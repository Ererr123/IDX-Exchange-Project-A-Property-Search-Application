import { useState, useEffect, useCallback } from "react";
import "./PropertyImageGallery.css";

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

export default function PropertyImageGallery({ photoString }) {
    const photos = parsePhotos(photoString);
    const [mainIndex, setMainIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    // close lightbox on escape key
    const handleKeyDown = useCallback((e) => {
        if (!lightboxOpen) return;
        if (e.key === "Escape") setLightboxOpen(false);
        if (e.key === "ArrowLeft") {
            setLightboxIndex((i) => (i > 0 ? i - 1 : photos.length - 1));
        }
        if (e.key === "ArrowRight") {
            setLightboxIndex((i) => (i < photos.length - 1 ? i + 1 : 0));
        }
    }, [lightboxOpen, photos.length]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    if (photos.length === 0) {
        return (
            <div className="gallery-placeholder">
                <img
                    src="https://placehold.co/800x500?text=No+Photos"
                    alt="No photos available"
                />
            </div>
        );
    }

    return (
        <div className="gallery-container">
            {/* main image */}
            <div className="gallery-main">
                <img
                    src={photos[mainIndex]}
                    alt={`Property ${mainIndex + 1}`}
                    onClick={() => {
                        setLightboxIndex(mainIndex);
                        setLightboxOpen(true);
                    }}
                />
            </div>

            {/* thumbnail strip */}
            <div className="gallery-thumbnails">
                {photos.map((photo, index) => (
                    <img
                        key={index}
                        src={photo}
                        alt={`Thumbnail ${index + 1}`}
                        className={mainIndex === index ? "active" : ""}
                        onClick={() => setMainIndex(index)}
                    />
                ))}
            </div>

            {/* lightbox */}
            {lightboxOpen && (
                <div
                    className="lightbox-overlay"
                    onClick={() => setLightboxOpen(false)}
                >
                    <div
                        className="lightbox-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="lightbox-close"
                            onClick={() => setLightboxOpen(false)}
                        >
                            ✕
                        </button>
                        <button
                            className="lightbox-arrow left"
                            onClick={() =>
                                setLightboxIndex((i) =>
                                    i > 0 ? i - 1 : photos.length - 1
                                )
                            }
                        >
                            ‹
                        </button>
                        <img
                            src={photos[lightboxIndex]}
                            alt={`Lightbox ${lightboxIndex + 1}`}
                        />
                        <button
                            className="lightbox-arrow right"
                            onClick={() =>
                                setLightboxIndex((i) =>
                                    i < photos.length - 1 ? i + 1 : 0
                                )
                            }
                        >
                            ›
                        </button>
                        <p className="lightbox-counter">
                            {lightboxIndex + 1} / {photos.length}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}