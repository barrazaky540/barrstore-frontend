```jsx
import { StrictMode, Component } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      errorMessage: "",
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage:
        error?.message ||
        "Terjadi kesalahan yang tidak diketahui.",
    };
  }

  componentDidCatch(error, errorInfo) {
    // Detail lengkap tetap masuk console untuk debugging
    console.error("=== BarrStore Error ===");
    console.error("Error:", error);
    console.error("Error Info:", errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center px-5">
          <div className="w-full max-w-md text-center">

            <div className="text-6xl mb-6">
              😵
            </div>

            <h1 className="text-2xl font-bold mb-3">
              Waduh, BarrStore lagi error
            </h1>

            <p className="text-slate-400 mb-6">
              Halaman mengalami masalah saat dimuat.
              Silakan coba muat ulang halaman.
            </p>

            <button
              onClick={this.handleReload}
              className="w-full px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 font-semibold transition"
            >
              🔄 Muat Ulang
            </button>

            <div className="mt-6 p-4 rounded-xl bg-slate-800 border border-slate-700 text-left">
              <p className="text-xs text-slate-500 mb-2">
                Detail error:
              </p>

              <p className="text-sm text-red-400 break-words">
                {this.state.errorMessage}
              </p>
            </div>

            <p className="text-xs text-slate-500 mt-5">
              Jika masalah terus terjadi, hubungi admin BarrStore.
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
```
