// format time from HH:MM:SS to 12hr format
export function formatTime(timeString) {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

// format date from ISO string to readable format
export function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

// extract remarks from all_data json blob
export function getRemarks(allData) {
    if (!allData) return null;
    try {
        const parsed = JSON.parse(allData);
        return parsed.OpenHouseRemarks || null;
    } catch {
        return null;
    }
}