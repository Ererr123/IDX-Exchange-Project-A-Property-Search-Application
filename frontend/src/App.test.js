import { render, screen, act } from "@testing-library/react";
import App from "./App";

jest.mock("react-router-dom", () => ({
    BrowserRouter: ({ children }) => <div>{children}</div>,
    Routes: ({ children }) => <div>{children}</div>,
    Route: ({ element, path }) => path === "/" ? element : null,
    useNavigate: () => jest.fn(),
    useParams: () => ({})
}));

// mock using the path relative to the module that imports it
jest.mock("./api/client", () => ({
    fetchProperties: jest.fn().mockResolvedValue({
        total: 0,
        results: []
    }),
    fetchPropertyDetail: jest.fn().mockResolvedValue({}),
    fetchOpenHouses: jest.fn().mockResolvedValue([])
}));

test("renders the listings page", async () => {
    await act(async () => {
        render(<App />);
    });
    // assert on error boundary not showing — app rendered without crashing
    expect(screen.queryByText("Something went wrong.")).not.toBeInTheDocument();
    expect(screen.getByText("Cannot connect to backend.")).toBeInTheDocument();
});