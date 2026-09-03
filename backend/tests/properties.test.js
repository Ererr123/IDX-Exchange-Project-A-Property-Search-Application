const request = require('supertest');
const express = require('express');

// Mock the database module to avoid real database calls
jest.mock('../db', () => ({
    query: jest.fn()
}));

const pool = require('../db');
const propertiesRouter = require('../routes/properties');

const app = express();
app.use(express.json());
app.use('/api/properties', propertiesRouter);

// sample property for  tests
const sampleProperty = {
    L_ListingID: '1118422731',
    L_Address: '1461 Laurel Way',
    L_City: 'Beverly Hills',
    L_State: 'CA',
    L_Zip: '90210',
    L_SystemPrice: 3950000,
    L_Keyword2: 4,
    LM_Dec_3: '5.0',
    LM_Int2_3: 3677,
    L_Photos: '[]'
};

const sampleOpenHouse = {
    id: 1,
    L_ListingID: '1118422731',
    OpenHouseDate: '2026-07-01T00:00:00.000Z',
    OH_StartTime: '10:00:00',
    OH_EndTime: '12:00:00',
    all_data: '{"OpenHouseRemarks":"Come see this beautiful home"}'
};

beforeEach(() => {
    jest.clearAllMocks();
});

//GET /api/properties tests

describe('GET /api/properties', () => {
    test('returns 20 properties with total count on success', async () => {
        pool.query
            .mockResolvedValueOnce([[{ total: 53122 }]])
            .mockResolvedValueOnce([[sampleProperty]]);

        const res = await request(app).get('/api/properties');

        expect(res.status).toBe(200);
        expect(res.body.total).toBe(53122);
        expect(res.body.results).toHaveLength(1);
        expect(res.body.limit).toBe(20);
        expect(res.body.offset).toBe(0);
    });

    test('returns 400 when limit is 0', async () => {
        const res = await request(app).get('/api/properties?limit=0');
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/limit/);
    });

    test('returns 400 when limit exceeds 100', async () => {
        const res = await request(app).get('/api/properties?limit=200');
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/limit/);
    });

    test('returns 400 when minPrice is not a number', async () => {
        const res = await request(app).get('/api/properties?minPrice=abc');
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/minPrice/);
    });

    test('returns 400 when maxPrice is not a number', async () => {
        const res = await request(app).get('/api/properties?maxPrice=abc');
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/maxPrice/);
    });

    test('returns 400 when beds is not a number', async () => {
        const res = await request(app).get('/api/properties?beds=abc');
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/beds/);
    });

    test('returns 400 when baths is not a number', async () => {
        const res = await request(app).get('/api/properties?baths=abc');
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/baths/);
    });

    test('returns 400 for invalid sortBy value', async () => {
        const res = await request(app).get('/api/properties?sortBy=invalid');
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/sortBy/);
    });

    test('returns 400 for invalid sortOrder value', async () => {
        const res = await request(app).get('/api/properties?sortBy=price&sortOrder=invalid');
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/sortOrder/);
    });

    test('filters by city correctly', async () => {
        pool.query
            .mockResolvedValueOnce([[{ total: 287 }]])
            .mockResolvedValueOnce([[sampleProperty]]);

        const res = await request(app).get('/api/properties?city=Beverly Hills');

        expect(res.status).toBe(200);
        expect(res.body.total).toBe(287);
    });

    test('paginates correctly with limit and offset', async () => {
        pool.query
            .mockResolvedValueOnce([[{ total: 53122 }]])
            .mockResolvedValueOnce([[sampleProperty]]);

        const res = await request(app).get('/api/properties?limit=10&offset=20');

        expect(res.status).toBe(200);
        expect(res.body.limit).toBe(10);
        expect(res.body.offset).toBe(20);
    });

    test('returns 500 when database query fails', async () => {
        pool.query.mockRejectedValue(new Error('DB connection failed'));

        const res = await request(app).get('/api/properties');

        expect(res.status).toBe(500);
        expect(res.body.error).toMatch(/DB connection failed/);
    });
});

// /api/properties/:id 

describe('GET /api/properties/:id', () => {
    test('returns property object on success', async () => {
        pool.query.mockResolvedValueOnce([[sampleProperty]]);

        const res = await request(app).get('/api/properties/1118422731');

        expect(res.status).toBe(200);
        expect(res.body.L_ListingID).toBe('1118422731');
        expect(res.body.L_Address).toBe('1461 Laurel Way');
    });

    test('returns 404 for unknown listing ID', async () => {
        pool.query.mockResolvedValueOnce([[]]);

        const res = await request(app).get('/api/properties/9999999999');

        expect(res.status).toBe(404);
        expect(res.body.error).toMatch(/not found/);
    });

    test('returns 400 for non-numeric ID', async () => {
        const res = await request(app).get('/api/properties/abc123');
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/Invalid/);
    });

    test('returns 400 for oversized ID', async () => {
        const res = await request(app).get('/api/properties/123456789012345678901');
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/Invalid/);
    });

    test('returns 500 when database query fails', async () => {
        pool.query.mockRejectedValue(new Error('DB connection failed'));

        const res = await request(app).get('/api/properties/1118422731');

        expect(res.status).toBe(500);
    });
});

// GET /api/properties/:id/openhouses tests

describe('GET /api/properties/:id/openhouses', () => {
    test('returns open houses array on success', async () => {
        // first query checks property exists, second gets open houses
        pool.query
            .mockResolvedValueOnce([[{ L_ListingID: '1118422731' }]])
            .mockResolvedValueOnce([[sampleOpenHouse]]);

        const res = await request(app).get('/api/properties/1118422731/openhouses');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0].L_ListingID).toBe('1118422731');
    });

    test('returns empty array when no open houses exist', async () => {
        pool.query
            .mockResolvedValueOnce([[{ L_ListingID: '1118422731' }]])
            .mockResolvedValueOnce([[]]);

        const res = await request(app).get('/api/properties/1118422731/openhouses');

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    test('returns 404 when property does not exist', async () => {
        pool.query.mockResolvedValueOnce([[]]);

        const res = await request(app).get('/api/properties/9999999999/openhouses');

        expect(res.status).toBe(404);
        expect(res.body.error).toMatch(/not found/);
    });

    test('returns 400 for invalid ID', async () => {
        const res = await request(app).get('/api/properties/abc/openhouses');
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/Invalid/);
    });

    test('returns 500 when database query fails', async () => {
        pool.query.mockRejectedValue(new Error('DB connection failed'));

        const res = await request(app).get('/api/properties/1118422731/openhouses');

        expect(res.status).toBe(500);
    });
});