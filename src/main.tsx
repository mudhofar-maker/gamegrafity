import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AppErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled app error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#060913] text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-rose-500/30 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center text-2xl font-bold">
              ⚠️
            </div>
            <h2 className="text-lg font-bold text-white">Terjadi Kendala Memuat Preview</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Aplikasi mengalami kendala rendering sementara. Silakan tekan tombol di bawah untuk memuat ulang status aplikasi.
            </p>
            {this.state.error && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-rose-300 text-left overflow-x-auto max-h-32">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}
            <button
              onClick={this.handleReload}
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition shadow-lg shadow-cyan-600/30"
            >
              🔄 Muat Ulang Aplikasi
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

window.addEventListener('error', (event) => {
  const msg = String(event?.message || event?.error?.message || '');
  if (msg.includes('WebSocket') || msg.includes('vite') || msg.includes('closed without opened')) {
    event.preventDefault();
    return;
  }
  console.warn('Global window error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  const reasonStr = String(event?.reason?.message || event?.reason || '');
  if (
    reasonStr.includes('WebSocket') ||
    reasonStr.includes('vite') ||
    reasonStr.includes('closed without opened')
  ) {
    // Environment constraint: HMR is disabled in AI Studio. Ignore WebSocket errors.
    event.preventDefault();
    return;
  }
  console.warn('Unhandled promise rejection:', event.reason);
});

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  );
} else {
  console.error('Root element not found in DOM');
}
