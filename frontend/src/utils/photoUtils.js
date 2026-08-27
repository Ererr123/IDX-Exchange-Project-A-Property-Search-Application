// parse L_Photos json string into array
export function parsePhotos(photoString) {
    if (!photoString) return [];
    try {
        const photos = JSON.parse(photoString);
        return Array.isArray(photos) ? photos : [];
    } catch {
        return [];
    }
}

// get first photo from L_Photos json string
export function getFirstPhoto(photoString) {
    const photos = parsePhotos(photoString);
    return photos.length > 0 ? photos[0] : null;
}