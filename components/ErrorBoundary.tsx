'use client';

import React, { Component, ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onReset?: () => void;
}

interface State { hasError: boolean; errorMsg: string }

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, errorMsg: "" };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, errorMsg: error.message };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error("[ErrorBoundary]", error, info.componentStack);
    }

    reset = () => {
        this.setState({ hasError: false, errorMsg: "" });
        this.props.onReset?.();
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div style={{
                    background: "#0F0F12", border: "1px solid rgba(240,82,79,0.3)",
                    borderRadius: 12, padding: "24px 20px", textAlign: "center",
                }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>⚠️</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#F0524F", marginBottom: 6 }}>Something went wrong</div>
                    {this.state.errorMsg && (
                        <div style={{ fontSize: 11, color: "#5A5865", marginBottom: 14, fontFamily: "'JetBrains Mono',monospace" }}>
                            {this.state.errorMsg}
                        </div>
                    )}
                    <button onClick={this.reset} style={{
                        padding: "7px 18px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
                        background: "#131316", color: "#EAEAEA", fontSize: 12, fontWeight: 600, cursor: "pointer",
                    }}>
                        Try Again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
