import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-red-200 max-w-2xl w-full">
                        <div className="flex items-center gap-3 mb-4 text-red-600">
                            <AlertTriangle size={32} />
                            <h1 className="text-2xl font-bold">Something went wrong</h1>
                        </div>
                        <p className="text-gray-600 mb-6">
                            The application encountered an unexpected error. Please show this screen to the developer.
                        </p>

                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto mb-6 text-sm font-mono leading-relaxed max-h-64">
                            <div className="font-bold text-red-400 mb-2">
                                {this.state.error?.toString()}
                            </div>
                            <div className="opacity-70 whitespace-pre-wrap">
                                {this.state.errorInfo?.componentStack}
                            </div>
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// eslint-disable-next-line react-refresh/only-export-components
export default ErrorBoundary;
