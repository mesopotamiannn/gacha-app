import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles.css'

window.onerror = function (message, error) {
  console.error("Global Error Caught:", message, error);
  document.body.innerHTML += `<div style="color:red; pading:20px;">Global Error: ${message}</div>`;
};


class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: '#ef4444', textAlign: 'center' }}>
          <h1>Something went wrong.</h1>
          <p style={{ background: '#fef2f2', padding: '1rem', borderRadius: '8px', border: '1px solid #fecaca', textAlign: 'left', overflow: 'auto' }}>
            {this.state.error?.toString()}
          </p>
          <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

console.log('Main: Starting mount (No StrictMode)');
const root = document.getElementById('root');

if (!root) {
  console.error("Root element not found");
} else {
  try {
    const reactRoot = ReactDOM.createRoot(root);
    reactRoot.render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );
    console.log("Main: Render called");
  } catch (e) {
    console.error("Main: Render Exception", e);
    root.innerHTML = "Render Exception Caught";
  }
}
