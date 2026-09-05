import { useEffect, useState } from "react";

const API_URL = "https://barrstore-backend.vercel.app";

const STATUS_OPTIONS = [
  "pending",
  "diproses",
  "selesai",
  "dibatalkan",
];

function Admin() {
  const [adminKey, setAdminKey] = useState(
    sessionStorage.getItem("barrstore_admin_key") || ""
  );

  const [inputKey, setInputKey] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadOrders(key = adminKey) {
    if (!key) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        headers: {
          "x-admin-key": key,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengambil pesanan");
      }

      setOrders(data);
    } catch (err) {
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  function loginAdmin(e) {
    e.preventDefault();

    if (!inputKey.trim()) {
      setError("Password admin wajib diisi");
      return;
    }

    sessionStorage.setItem("barrstore_admin_key", inputKey);
    setAdminKey(inputKey);
    setInputKey("");
  }

  useEffect(() => {
    if (adminKey) {
      loadOrders(adminKey);
    }
  }, [adminKey]);

  async function updateStatus(id, status) {
    try {
      const response = await fetch(
        `${API_URL}/api/orders/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": adminKey,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengubah status");
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === id
            ? { ...order, status }
            : order
        )
      );
    } catch (err) {
      alert(err.message);
    }
  }

  function logout() {
    sessionStorage.removeItem("barrstore_admin_key");
    setAdminKey("");
    setOrders([]);
  }

  function formatRupiah(price) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price || 0);
  }

  function getStatusClass(status) {
    if (status === "pending") {
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    }

    if (status === "diproses") {
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    }

    if (status === "selesai") {
      return "bg-green-500/20 text-green-300 border-green-500/30";
    }

    if (status === "dibatalkan") {
      return "bg-red-500/20 text-red-300 border-red-500/30";
    }

    return "bg-slate-700 text-slate-200 border-slate-600";
  }

  // =========================
  // LOGIN ADMIN
  // =========================

  if (!adminKey) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">⚙️</div>

            <h1 className="text-3xl font-bold">
              BarrStore Admin
            </h1>

            <p className="text-slate-400 mt-2">
              Masuk untuk mengelola pesanan
            </p>
          </div>

          <form onSubmit={loginAdmin}>
            <label className="block text-sm text-slate-300 mb-2">
              Password Admin
            </label>

            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Masukkan password admin"
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-teal-400 text-white"
            />

            {error && (
              <p className="text-red-400 text-sm mt-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full mt-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition"
            >
              Masuk Admin
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================
  // DASHBOARD ADMIN
  // =========================

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const processingOrders = orders.filter(
    (order) => order.status === "diproses"
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "selesai"
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* HEADER */}

      <header className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              ⚙️ BarrStore Admin
            </h1>

            <p className="text-sm text-slate-400">
              Dashboard pengelolaan pesanan
            </p>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20"
          >
            Keluar
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* STATISTICS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-slate-400 text-sm">
              Total Pesanan
            </p>

            <p className="text-3xl font-bold mt-2">
              {totalOrders}
            </p>
          </div>

          <div className="bg-slate-900 border border-yellow-500/20 rounded-2xl p-5">
            <p className="text-yellow-300 text-sm">
              Pending
            </p>

            <p className="text-3xl font-bold mt-2">
              {pendingOrders}
            </p>
          </div>

          <div className="bg-slate-900 border border-blue-500/20 rounded-2xl p-5">
            <p className="text-blue-300 text-sm">
              Diproses
            </p>

            <p className="text-3xl font-bold mt-2">
              {processingOrders}
            </p>
          </div>

          <div className="bg-slate-900 border border-green-500/20 rounded-2xl p-5">
            <p className="text-green-300 text-sm">
              Selesai
            </p>

            <p className="text-3xl font-bold mt-2">
              {completedOrders}
            </p>
          </div>

        </div>

        {/* ORDER HEADER */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-bold">
              Semua Pesanan
            </h2>

            <p className="text-sm text-slate-400">
              Kelola status pesanan BarrStore
            </p>
          </div>

          <button
            onClick={() => loadOrders()}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-teal-400 disabled:opacity-50"
          >
            {loading ? "Memuat..." : "🔄 Refresh"}
          </button>
        </div>

        {error && (
          <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300">
            {error}
          </div>
        )}

        {/* TABLE */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-slate-800/70">
                <tr>
                  <th className="text-left px-5 py-4">
                    ID
                  </th>

                  <th className="text-left px-5 py-4">
                    Username
                  </th>

                  <th className="text-left px-5 py-4">
                    Layanan
                  </th>

                  <th className="text-left px-5 py-4">
                    Game
                  </th>

                  <th className="text-left px-5 py-4">
                    Nominal
                  </th>

                  <th className="text-left px-5 py-4">
                    Harga
                  </th>

                  <th className="text-left px-5 py-4">
                    Status
                  </th>

                  <th className="text-left px-5 py-4">
                    Tanggal
                  </th>
                </tr>
              </thead>

              <tbody>

                {orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-12 text-slate-400"
                    >
                      {loading
                        ? "Memuat pesanan..."
                        : "Belum ada pesanan"}
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-t border-slate-800 hover:bg-slate-800/30"
                    >

                      <td className="px-5 py-4 font-bold">
                        #{order.id}
                      </td>

                      <td className="px-5 py-4">
                        {order.username || "-"}
                      </td>

                      <td className="px-5 py-4 capitalize">
                        {order.service || "-"}
                      </td>

                      <td className="px-5 py-4">
                        {order.game || "-"}
                      </td>

                      <td className="px-5 py-4">
                        {order.nominal || "-"}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        {formatRupiah(order.price)}
                      </td>

                      <td className="px-5 py-4">

                        <select
                          value={order.status || "pending"}
                          onChange={(e) =>
                            updateStatus(
                              order.id,
                              e.target.value
                            )
                          }
                          className={`px-3 py-2 rounded-lg border outline-none cursor-pointer ${getStatusClass(
                            order.status
                          )}`}
                        >

                          {STATUS_OPTIONS.map(
                            (status) => (
                              <option
                                key={status}
                                value={status}
                                className="bg-slate-900 text-white"
                              >
                                {status}
                              </option>
                            )
                          )}

                        </select>

                      </td>

                      <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                        {order.created_at || "-"}
                      </td>

                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>

        </div>

      </main>
    </div>
  );
}

export default Admin;