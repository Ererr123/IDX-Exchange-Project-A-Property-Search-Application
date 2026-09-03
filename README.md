# IDX-Exchange-Project-A-Property-Search-Application
A Zillow/Redfin-style property search experience backed by real MLS data. 

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React | 19.x |
| Routing | React Router | 7.x |
| HTTP Client | Axios | 1.x |
| Backend | Node.js + Express | 18.x LTS |
| Database | MySQL 8 | 8.0.46 |
| Container | Docker | latest |
| Testing | Jest + Supertest + RTL | latest |

---

## On Local Machine

### Prerequisites
- Node.js LTS
- Docker Desktop
- Git

### 1. Clone the repository
```bash
git clone https://github.com/your-username/IDX-Exchange-Project-A-Property-Search-Application.git
cd IDX-Exchange-Project-A-Property-Search-Application
```

### 2. Start the database
```bash
docker run --name idx-mysql-local \
  -e MYSQL_ROOT_PASSWORD=yourpassword \
  -e MYSQL_DATABASE=rets \
  -p 3306:3306 \
  -d mysql:8.0
```

Import the SQL files:
```bash
docker cp rets_property.sql idx-mysql-local:/tmp/
docker cp rets_openhouse.sql idx-mysql-local:/tmp/
docker exec -i idx-mysql-local mysql -uroot -pyourpassword rets -e "source /tmp/rets_property.sql"
docker exec -i idx-mysql-local mysql -uroot -pyourpassword rets -e "source /tmp/rets_openhouse.sql"
```

### 3. Set up the backend
```bash
cd backend
npm install
```

Create `backend/.env`:

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=rets
PORT=5000


Start the backend:
```bash
npm run dev
```

### 4. Set up the frontend
```bash
cd frontend
npm install
```

Create `frontend/.env`:

REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key


Start the frontend:
```bash
npm start
```

### 5. Open the app
Visit `http://localhost:3000`

---

## Architecture

React (port 3000) → Express API (port 5000) → MySQL (port 3306)


React never connects directly to MySQL. All data flows through the Express API.

frontend/src/
api/ # axios client and API functions
components/ # reusable UI components
hooks/ # custom React hooks
pages/ # page-level components
utils/ # pure helper functions
backend/
routes/ # Express route handlers
db.js # MySQL connection pool
server.js # Express app entry point


---

## API Reference

### GET /api/health
Check database connectivity.

Response:
```json
{ "status": "ok", "database": "connected" }
```

---

### GET /api/properties
Get paginated, filterable property listings.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| limit | number | Results per page (1-100, default 20) |
| offset | number | Number of results to skip (default 0) |
| city | string | Filter by city name |
| zipcode | string | Filter by ZIP code |
| minPrice | number | Minimum listing price |
| maxPrice | number | Maximum listing price |
| beds | number | Minimum number of bedrooms |
| baths | number | Minimum number of bathrooms |
| sortBy | string | Sort field: price, sqft, beds, date |
| sortOrder | string | asc or desc |

Example Request:

GET /api/properties?city=Beverly Hills&minPrice=500000&beds=3&limit=20&offset=0


Example Response:
```json
{
  "total": 287,
  "limit": 20,
  "offset": 0,
  "results": [
    {
      "L_ListingID": "1118422731",
      "L_Address": "1461 Laurel Way",
      "L_City": "Beverly Hills",
      "L_State": "CA",
      "L_Zip": "90210",
      "L_SystemPrice": 3950000,
      "L_Keyword2": 4,
      "LM_Dec_3": "5.0",
      "LM_Int2_3": 3677,
      "L_Photos": "[\"https://...\"]"
    }
  ]
}
```

---

### GET /api/properties/:id
Get a single property by listing ID.

Example Request:

GET /api/properties/1118422731


Example Response:
```json
{
  "L_ListingID": "1118422731",
  "L_Address": "1461 Laurel Way",
  "L_City": "Beverly Hills",
  "L_State": "CA",
  "L_Zip": "90210",
  "L_SystemPrice": 3950000,
  "L_Keyword2": 4,
  "LM_Dec_3": "5.0",
  "LM_Int2_3": 3677,
  "YearBuilt": 1987,
  "LotSizeAcres": 0.34,
  "LMD_MP_Latitude": 34.0736,
  "LMD_MP_Longitude": -118.4004,
  "L_Remarks": "Beautiful home in the heart of Beverly Hills...",
  "L_Photos": "[\"https://...\"]"
}
```

Error Responses:
- `400` — malformed or oversized ID
- `404` — listing ID not found

---

### GET /api/properties/:id/openhouses
Get open house events for a property.

Example Request:

GET /api/properties/1118422731/openhouses


Example Response:
```json
[
  {
    "id": 1,
    "L_ListingID": "1118422731",
    "OpenHouseDate": "2026-07-01T00:00:00.000Z",
    "OH_StartTime": "10:00:00",
    "OH_EndTime": "12:00:00",
    "all_data": "{\"OpenHouseRemarks\": \"Come see this beautiful home\"}"
  }
]
```

Returns empty array `[]` if no open houses scheduled.

**Error Responses:**
- `400` — malformed or oversized ID
- `404` — listing ID not found

---

## Database

### rets_property
Primary table containing MLS property listings.

| Column | Type | Description |
|--------|------|-------------|
| L_ListingID | varchar | Primary MLS listing identifier |
| L_Address | varchar | Street address |
| L_City | varchar | City (inconsistent casing in data) |
| L_State | varchar | State abbreviation |
| L_Zip | varchar | ZIP code |
| L_SystemPrice | decimal | Listing price |
| L_Keyword2 | int | Number of bedrooms |
| LM_Dec_3 | decimal | Number of bathrooms |
| LM_Int2_3 | int | Square footage |
| L_Photos | longtext | JSON array of photo URLs |
| LMD_MP_Latitude | decimal | Property latitude |
| LMD_MP_Longitude | decimal | Property longitude |
| L_Remarks | mediumtext | Property description |
| YearBuilt | int | Year property was built |
| LotSizeAcres | decimal | Lot size in acres |

### rets_openhouse
Open house events linked to property listings.

| Column | Type | Description |
|--------|------|-------------|
| id | int | Auto-increment primary key |
| L_ListingID | varchar | Foreign key to rets_property |
| OpenHouseDate | date | Date of open house |
| OH_StartTime | time | Start time |
| OH_EndTime | time | End time |
| all_data | longtext | JSON blob with additional fields including OpenHouseRemarks |

**Relationship:** `rets_openhouse.L_ListingID` → `rets_property.L_ListingID` (one property, many open houses)

---

## Known Issues

- **City filter case sensitivity** — `LOWER(TRIM())` is applied to city queries but prevents index usage, resulting in slower queries on large datasets
- **Photo CDN cookies** — Browser warns about third-party cookies from `api.cotality.com` and `api-trestle.corelogic.com`. These come from the MLS photo URLs and cannot be resolved without a proxy
- **Google Maps localhost restriction** — The Maps Embed API may reject requests from localhost depending on key restriction settings. Set restrictions to None for local development
- **Orphaned open house records** — Some records in `rets_openhouse` reference listing IDs that no longer exist in `rets_property`. These return 404 correctly
