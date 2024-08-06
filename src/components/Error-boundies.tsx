"use client";
import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // You can log the error to a logging service
        console.error('Error caught by error boundary:', error, errorInfo);
    }

    render(): ReactNode {
        if (this.state.hasError) {
            // Styling using Tailwind CSS
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-100">
                    <div className="bg-white p-8 rounded shadow-md">
                        <h2 className="text-2xl font-bold mb-4 text-red-600">Something went wrong.</h2>
                        <p className="text-gray-800">
                            We apologize for the inconvenience. Please try again later.
                        </p>
                        {/* You can also log the error to a logging service */}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
