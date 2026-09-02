import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('StudyFlow Uncaught Render Error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#0B0F19] text-white flex flex-col items-center justify-center p-6 select-none font-sans">
          <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-5">
              <AlertTriangle className="w-7 h-7 stroke-[2.2]" />
            </div>
            
            <h2 className="text-xl font-bold text-slate-100 font-serif mb-2">
              Something went wrong
            </h2>
            
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              A temporary issue occurred while rendering. Your data is 100% safe in local storage.
            </p>

            {this.state.error && (
              <div className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 text-left mb-6 overflow-x-auto max-h-36 custom-scrollbar text-[11px] font-mono text-rose-300">
                {this.state.error.toString()}
              </div>
            )}

            <button
              type="button"
              onClick={this.handleReset}
              className="w-full h-11 bg-[#176BFF] hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Workspace</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
