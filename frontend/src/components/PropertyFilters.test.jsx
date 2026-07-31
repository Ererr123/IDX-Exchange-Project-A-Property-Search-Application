import { render, screen, fireEvent } from "@testing-library/react";
import PropertyFilters from "./PropertyFilters";

describe("PropertyFilters", () => {
    test("renders all six inputs", () => {
        render(<PropertyFilters onSearch={jest.fn()} />);

        expect(screen.getByPlaceholderText("City")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("ZIP Code")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Min Price")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Max Price")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Any Beds")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Any Baths")).toBeInTheDocument();
    });

    test("calls onSearch with filter values when search is clicked", () => {
        const onSearch = jest.fn();
        render(<PropertyFilters onSearch={onSearch} />);

        fireEvent.change(screen.getByPlaceholderText("City"), {
            target: { name: "city", value: "Beverly Hills" }
        });

        fireEvent.click(screen.getByText("Search"));

        expect(onSearch).toHaveBeenCalledWith({ city: "Beverly Hills" });
    });

    test("strips empty values before calling onSearch", () => {
        const onSearch = jest.fn();
        render(<PropertyFilters onSearch={onSearch} />);

        fireEvent.change(screen.getByPlaceholderText("City"), {
            target: { name: "city", value: "Portland" }
        });

        fireEvent.click(screen.getByText("Search"));

        // only city should be in the object, not the empty fields
        expect(onSearch).toHaveBeenCalledWith({ city: "Portland" });
        expect(onSearch).not.toHaveBeenCalledWith(
            expect.objectContaining({ zipcode: "" })
        );
    });

    test("resets form and calls onSearch with empty object when clear is clicked", () => {
        const onSearch = jest.fn();
        render(<PropertyFilters onSearch={onSearch} />);

        fireEvent.change(screen.getByPlaceholderText("City"), {
            target: { name: "city", value: "Beverly Hills" }
        });

        fireEvent.click(screen.getByText("Clear Filters"));

        expect(screen.getByPlaceholderText("City").value).toBe("");
        expect(onSearch).toHaveBeenCalledWith({});
    });
});