import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled Application Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#0b0c10',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
        }}>
          <div style={{
            maxWidth: '600px',
            width: '100%',
            backgroundColor: '#13151b',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '28px' }}>⚠️</span>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#ef4444' }}>
                Application Notice
              </h2>
            </div>
            
            <p style={{ fontSize: '14px', color: '#a0a0ab', marginBottom: '20px', lineHeight: 1.6 }}>
              A client runtime notice occurred. You can reset your local cache or reload the page:
            </p>

            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              padding: '16px',
              borderRadius: '8px',
              fontSize: '12px',
              fontFamily: 'monospace',
              color: '#f87171',
              marginBottom: '24px',
              overflowX: 'auto',
              maxHeight: '180px'
            }}>
              {this.state.error?.toString() || 'Unknown Error'}
              {this.state.errorInfo?.componentStack && (
                <pre style={{ marginTop: '8px', color: '#888', whiteSpace: 'pre-wrap' }}>
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#1db954',
                  color: '#000000',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                Clear Local Cache & Reset
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontWeight: 600,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
