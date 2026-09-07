import { render, screen, fireEvent } from "@testing-library/react";
import PropertyCard from "./PropertyCard";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate
}));

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

describe("PropertyCard", () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    test("renders price correctly", () => {
        render(<PropertyCard property={sampleProperty} />);
        expect(screen.getByText("$3,950,000")).toBeInTheDocument();
    });

    test("renders address correctly", () => {
        render(<PropertyCard property={sampleProperty} />);
        expect(screen.getByText("1461 Laurel Way")).toBeInTheDocument();
    });

    test("renders city and state correctly", () => {
        render(<PropertyCard property={sampleProperty} />);
        expect(screen.getByText("Beverly Hills, CA")).toBeInTheDocument();
    });

    test("renders beds baths and sqft", () => {
        render(<PropertyCard property={sampleProperty} />);
        expect(screen.getByText("4")).toBeInTheDocument();
        expect(screen.getByText("5.0")).toBeInTheDocument();
        expect(screen.getByText("3677")).toBeInTheDocument();
    });

    test("navigates to detail page when content is clicked", () => {
        render(<PropertyCard property={sampleProperty} />);
        fireEvent.click(screen.getByText("1461 Laurel Way"));
        expect(mockNavigate).toHaveBeenCalledWith("/property/1118422731");
    });

    test("shows placeholder when no photos", () => {
        const noPhotoProperty = { ...sampleProperty, L_Photos: "" };
        render(<PropertyCard property={noPhotoProperty} />);
        const imgs = screen.getAllByRole("img");
        expect(imgs[0].src).toContain("placehold.co");
    });
});