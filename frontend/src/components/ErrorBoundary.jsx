import { Component } from "react";

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        // errors are caught and displayed in the recovery ui however cause crash
        //when loged so had to remove for now
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "70vh",
                    gap: "20px"
                }}>
                    <h2>Something went wrong.</h2>
                    <p>{this.state.error?.message}</p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        style={{
                            padding: "10px 20px",
                            background: "#333",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer"
                        }}
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}