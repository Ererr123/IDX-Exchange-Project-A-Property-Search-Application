import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "./Pagination";

describe("Pagination", () => {
    test("renders nothing when totalPages is 1", () => {
        const { container } = render(
            <Pagination currentPage={1} totalPages={1} onPageChange={jest.fn()} />
        );
        expect(container.firstChild).toBeNull();
    });

    test("disables previous button on page 1", () => {
        render(
            <Pagination currentPage={1} totalPages={10} onPageChange={jest.fn()} />
        );
        expect(screen.getByText("Previous")).toBeDisabled();
        expect(screen.getByText("Next")).not.toBeDisabled();
    });

    test("disables next button on last page", () => {
        render(
            <Pagination currentPage={10} totalPages={10} onPageChange={jest.fn()} />
        );
        expect(screen.getByText("Next")).toBeDisabled();
        expect(screen.getByText("Previous")).not.toBeDisabled();
    });

    test("calls onPageChange with correct page when page number clicked", () => {
        const onPageChange = jest.fn();
        render(
            <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />
        );
        fireEvent.click(screen.getByText("3"));
        expect(onPageChange).toHaveBeenCalledWith(3);
    });

    test("calls onPageChange with previous page when previous clicked", () => {
        const onPageChange = jest.fn();
        render(
            <Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />
        );
        fireEvent.click(screen.getByText("Previous"));
        expect(onPageChange).toHaveBeenCalledWith(4);
    });

    test("calls onPageChange with next page when next clicked", () => {
        const onPageChange = jest.fn();
        render(
            <Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />
        );
        fireEvent.click(screen.getByText("Next"));
        expect(onPageChange).toHaveBeenCalledWith(6);
    });

    test("shows ellipsis for large page counts in middle", () => {
        render(
            <Pagination currentPage={10} totalPages={24} onPageChange={jest.fn()} />
        );
        const ellipses = screen.getAllByText("...");
        expect(ellipses).toHaveLength(2);
        expect(screen.getByText("1")).toBeInTheDocument();
        expect(screen.getByText("24")).toBeInTheDocument();
    });

    test("does not duplicate last page number near end", () => {
        render(
            <Pagination currentPage={22} totalPages={24} onPageChange={jest.fn()} />
        );
        const buttons = screen.getAllByText("24");
        expect(buttons).toHaveLength(1);
    });

    test("shows all pages without ellipsis when totalPages is 7 or less", () => {
        render(
            <Pagination currentPage={1} totalPages={5} onPageChange={jest.fn()} />
        );
        expect(screen.getByText("1")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument();
        expect(screen.getByText("3")).toBeInTheDocument();
        expect(screen.getByText("4")).toBeInTheDocument();
        expect(screen.getByText("5")).toBeInTheDocument();
        expect(screen.queryByText("...")).not.toBeInTheDocument();
    });
});