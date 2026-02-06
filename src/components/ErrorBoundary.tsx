import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({ error, errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '2rem',
                    margin: '2rem',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-xl)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    backdropFilter: 'blur(12px)'
                }}>
                    <h1 style={{ color: 'var(--error)' }}>Something went wrong.</h1>
                    <h3 style={{ marginTop: '1rem' }}>Error:</h3>
                    <pre style={{
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        padding: '1rem',
                        overflow: 'auto',
                        borderRadius: 'var(--radius-lg)',
                        color: 'var(--error)'
                    }}>
                        {this.state.error?.toString()}
                    </pre>
                    <h3 style={{ marginTop: '1rem' }}>Component Stack:</h3>
                    <pre style={{
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        padding: '1rem',
                        overflow: 'auto',
                        borderRadius: 'var(--radius-lg)',
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)'
                    }}>
                        {this.state.errorInfo?.componentStack}
                    </pre>
                    <button
                        className="btn btn-primary"
                        onClick={() => window.location.reload()}
                        style={{ marginTop: '1.5rem' }}
                    >
                        Reload Application
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
