import { StrictMode, Component } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("BarrStore Error:", error);
    console.error("Error Info:", errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const errorMessage =
        this.state.error?.message ||
        this.state.error?.toString() ||
        "Unknown error";

      const errorStack = this.state.error?.stack || "";

      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-lg text-center">
            <div className="text-6xl mb-5">😵</div>

            <h1 className="text-2xl font-bold mb-3">
              Waduh, BarrStore lagi error
            </h1>

            <p className="text-slate-400 mb-6">
              Terjadi kesalahan saat menampilkan halaman.
            </p>

            <button
              onClick={this.handleReload}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition mb-6"
            >
              🔄 Muat Ulang
            </button>

            {/* DETAIL ERROR */}
            <div className="text-left">
              <p className="text-sm font-semibold text-red-400 mb-2">
                Detail Error:
              </p>

              <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 overflow-auto">
                <p className="text-sm text-red-300 break-words">
                  {errorMessage}
                </p>

                {errorStack && (
                  <pre className="mt-4 text-xs text-slate-400 whitespace-pre-wrap break-words">
                    {errorStack}
                  </pre>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-5">
              Kirim tulisan error di atas ke admin/developer BarrStore.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);