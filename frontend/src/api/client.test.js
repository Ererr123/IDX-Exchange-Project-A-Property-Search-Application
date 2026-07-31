const mockGet = jest.fn();

jest.mock("axios", () => ({
    create: () => ({ get: mockGet })
}));

const { fetchProperties } = require("./client");

describe("fetchProperties", () => {
    beforeEach(() => {
        mockGet.mockClear();
    });

    test("returns data on success", async () => {
        const mockData = { total: 1, results: [{ L_ListingID: "123" }] };
        mockGet.mockResolvedValue({ data: mockData });

        const result = await fetchProperties({ limit: 20, offset: 0 });
        expect(result).toEqual(mockData);
    });

    test("throws cannot connect when status is 500", async () => {
        mockGet.mockRejectedValue({
            response: { status: 500, data: {} }
        });

        await expect(fetchProperties()).rejects.toThrow("Cannot connect to backend.");
    });

    test("throws api error message on 400", async () => {
        mockGet.mockRejectedValue({
            response: {
                status: 400,
                data: { error: "limit must be between 1 and 100" }
            }
        });

        await expect(fetchProperties()).rejects.toThrow("limit must be between 1 and 100");
    });

    test("throws cannot connect when no response received", async () => {
        mockGet.mockRejectedValue({ request: {} });

        await expect(fetchProperties()).rejects.toThrow("Cannot connect to backend.");
    });
});