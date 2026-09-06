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
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-6">
          <div className="w-full max-w-md text-center">
            <div className="text-6xl mb-5">😵</div>

            <h1 className="text-2xl font-bold mb-3">
              Waduh, BarrStore lagi error
            </h1>

            <p className="text-slate-400 mb-6">
              Terjadi kesalahan saat menampilkan halaman.
              Coba muat ulang halaman untuk melanjutkan.
            </p>

            <button
              onClick={this.handleReload}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition"
            >
              🔄 Muat Ulang
            </button>

            {import.meta.env.DEV && this.state.error && (
              <pre className="mt-6 p-4 rounded-xl bg-slate-800 text-left text-xs text-red-400 overflow-auto">
                {this.state.error.toString()}
              </pre>
            )}
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