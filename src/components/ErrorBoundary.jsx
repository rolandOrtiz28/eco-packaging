import React from 'react';

class ErrorBoundary extends React.Component {
  state = { error: null, errorInfo: null };

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error('ErrorBoundary caught an error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Something went wrong.</h2>
            <p className="mt-2 text-muted-foreground">
              {this.state.error.message || 'An unexpected error occurred.'}
            </p>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-4 text-left text-sm text-red-500 overflow-auto">
                {this.state.errorInfo?.componentStack}
              </pre>
            )}
            <button
              className="mt-4 px-4 py-2 bg-eco text-white rounded"
              onClick={() => window.location.reload()}
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

export default ErrorBoundary;