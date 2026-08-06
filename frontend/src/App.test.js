import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./api/client", () => ({
    fetchProperties: jest.fn().mockResolvedValue({
        total: 0,
        results: []
    })
}));

test("renders property listings heading", () => {
    render(<App />);
    expect(screen.getByText("Loading properties...")).toBeInTheDocument();
});