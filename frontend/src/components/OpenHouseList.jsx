import "./OpenHouseList.css";
import { formatTime, formatDate, getRemarks } from "../utils/formatUtils";

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