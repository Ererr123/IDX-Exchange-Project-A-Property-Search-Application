import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PropertyCard from "./PropertyCard";

// Mock the useNavigate hook from react-router-dom
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate
}));

// Sample property data for testing
const sampleProperty = {
    L_ListingID: "1118422731",
    L_Address: "1461 Laurel Way",
    L_City: "Beverly Hills",
    L_State: "CA",
    L_SystemPrice: 3950000,
    L_Keyword2: 4,
    LM_Dec_3: "5.0",
    LM_Int2_3: 3677,
    L_Photos: '["https://example.com/photo1.jpg"]'
};

// Test suite for PropertyCard component
describe("PropertyCard", () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    test("renders price correctly", () => {
        render(
            <MemoryRouter>
                <PropertyCard property={sampleProperty} />
            </MemoryRouter>
        );
        expect(screen.getByText("$3,950,000")).toBeInTheDocument();
    });

    test("renders address correctly", () => {
        render(
            <MemoryRouter>
                <PropertyCard property={sampleProperty} />
            </MemoryRouter>
        );
        expect(screen.getByText("1461 Laurel Way")).toBeInTheDocument();
    });

    test("renders city and state correctly", () => {
        render(
            <MemoryRouter>
                <PropertyCard property={sampleProperty} />
            </MemoryRouter>
        );
        expect(screen.getByText("Beverly Hills, CA")).toBeInTheDocument();
    });

    test("renders beds, baths, and sqft", () => {
        render(
            <MemoryRouter>
                <PropertyCard property={sampleProperty} />
            </MemoryRouter>
        );
        expect(screen.getByText("4")).toBeInTheDocument();
        expect(screen.getByText("5.0")).toBeInTheDocument();
        expect(screen.getByText("3677")).toBeInTheDocument();
    });

    test("navigates to detail page when content is clicked", () => {
        render(
            <MemoryRouter>
                <PropertyCard property={sampleProperty} />
            </MemoryRouter>
        );
        fireEvent.click(screen.getByText("1461 Laurel Way"));
        expect(mockNavigate).toHaveBeenCalledWith("/property/1118422731");
    });

    test("shows placeholder when no photos", () => {
        const noPhotoProperty = { ...sampleProperty, L_Photos: "" };
        render(
            <MemoryRouter>
                <PropertyCard property={noPhotoProperty} />
            </MemoryRouter>
        );
        const img = screen.getAllByRole("img")[0];
        expect(img.src).toContain("placehold.co");
    });
});