import "./OpenHouseList.css";

// format time from HH:MM:SS to 12hr format
function formatTime(timeString) {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

// format date from ISO string
function formatDate(dateString) {
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
function getRemarks(allData) {
    if (!allData) return null;
    try {
        const parsed = JSON.parse(allData);
        return parsed.OpenHouseRemarks || null;
    } catch {
        return null;
    }
}

export default function OpenHouseList({ openHouses }) {
    if (!openHouses || openHouses.length === 0) {
        return (
            <div className="open-house-list">
                <h2>Open Houses</h2>
                <p className="no-open-houses">No open houses scheduled.</p>
            </div>
        );
    }

    return (
        <div className="open-house-list">
            <h2>Open Houses</h2>
            {openHouses.map((oh) => (
                <div key={oh.id} className="open-house-item">
                    <p className="open-house-date">
                        {formatDate(oh.OpenHouseDate)}
                    </p>
                    <p className="open-house-time">
                        {formatTime(oh.OH_StartTime)} – {formatTime(oh.OH_EndTime)}
                    </p>
                    {getRemarks(oh.all_data) && (
                        <p className="open-house-remarks">
                            {getRemarks(oh.all_data)}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}