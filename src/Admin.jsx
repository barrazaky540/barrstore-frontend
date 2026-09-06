import { useEffect, useState } from "react";

function Admin({ API_URL, onBack }) {
  const BASE_URL =
    API_URL || "https://barrstore-backend-bhjj.vercel.app";

  const [adminKey, setAdminKey] = useState(
    sessionStorage.getItem("barrstore_admin_key") || ""
  );

  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalOmzet: 0,
    pending: 0,
    diproses: 0,
    selesai: 0,
    dibatalkan: 0,
  });

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");

  // =========================
  // VOUCHER
  // =========================

  const [vouchers, setVouchers] = useState([]);

  const [voucherForm, setVoucherForm] = useState({
    code: "",
    type: "nominal",
    value: "",
    maxUses: "",
    expiresAt: "",
  });

  const [voucherLoading, setVoucherLoading] = useState(false);

  // =========================
  // LOGIN
  // =========================

  useEffect(() => {
    const savedKey = sessionStorage.getItem(
      "barrstore_admin_key"
    );

    if (savedKey) {
      checkLogin(savedKey);
    }
  }, []);

  async function checkLogin(key) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        BASE_URL + "/api/orders?t=" + Date.now(),
        {
          headers: {
            "x-admin-key": key,
            "Cache-Control": "no-cache",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        sessionStorage.removeItem(
          "barrstore_admin_key"
        );

        setAdminKey("");
        setLoggedIn(false);
        setError("Password admin salah.");
        return;
      }

      const data = await response.json();

      setOrders(data);
      setAdminKey(key);
      setLoggedIn(true);

      sessionStorage.setItem(
        "barrstore_admin_key",
        key
      );

      await loadStats(key);
      await loadVouchers(key);
    } catch (err) {
      console.error(err);
      setError("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // STATISTIK
  // =========================

  async function loadStats(key = adminKey) {
    try {
      const response = await fetch(
        BASE_URL +
          "/api/admin/stats?t=" +
          Date.now(),
        {
          headers: {
            "x-admin-key": key,
            "Cache-Control": "no-cache",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      if (data.success && data.stats) {
        setStats({
          totalOrders: Number(
            data.stats.totalOrders || 0
          ),
          totalUsers: Number(
            data.stats.totalUsers || 0
          ),
          totalOmzet: Number(
            data.stats.totalOmzet || 0
          ),
          pending: Number(
            data.stats.pending || 0
          ),
          diproses: Number(
            data.stats.diproses || 0
          ),
          selesai: Number(
            data.stats.selesai || 0
          ),
          dibatalkan: Number(
            data.stats.dibatalkan || 0
          ),
        });
      }
    } catch (err) {
      console.error("STAT ERROR:", err);
    }
  }

  // =========================
  // LOAD VOUCHERS
  // =========================

  async function loadVouchers(key = adminKey) {
    try {
      const response = await fetch(
        BASE_URL +
          "/api/admin/vouchers?t=" +
          Date.now(),
        {
          headers: {
            "x-admin-key": key,
            "Cache-Control": "no-cache",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        console.error(
          "Gagal mengambil voucher:",
          response.status
        );
        return;
      }

      const data = await response.json();

      if (data.success) {
        setVouchers(data.vouchers || []);
      }
    } catch (err) {
      console.error(
        "VOUCHER ERROR:",
        err
      );
    }
  }

  // =========================
  // REFRESH
  // =========================

  async function refreshData() {
    try {
      setLoading(true);

      const response = await fetch(
        BASE_URL +
          "/api/orders?t=" +
          Date.now(),
        {
          headers: {
            "x-admin-key": adminKey,
            "Cache-Control": "no-cache",
          },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Gagal mengambil pesanan."
        );
      }

      const data = await response.json();

      setOrders(data);

      await loadStats(adminKey);
      await loadVouchers(adminKey);
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui data.");
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // LOGIN FORM
  // =========================

  async function handleLogin(e) {
    e.preventDefault();

    if (!password.trim()) {
      setError("Password wajib diisi.");
      return;
    }

    await checkLogin(password);
  }

  // =========================
  // LOGOUT
  // =========================

  function logout() {
    sessionStorage.removeItem(
      "barrstore_admin_key"
    );

    setAdminKey("");
    setPassword("");
    setLoggedIn(false);
    setOrders([]);
    setVouchers([]);
    setError("");

    setStats({
      totalOrders: 0,
      totalUsers: 0,
      totalOmzet: 0,
      pending: 0,
      diproses: 0,
      selesai: 0,
      dibatalkan: 0,
    });
  }

  // =========================
  // UPDATE STATUS ORDER
  // =========================

  async function updateStatus(id, status) {
    try {
      const response = await fetch(
        BASE_URL +
          "/api/orders/" +
          id +
          "/status",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": adminKey,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Gagal mengubah status."
        );
        return;
      }

      setOrders((prev) =>
        prev.map((order) =>
          Number(order.id) === Number(id)
            ? {
                ...order,
                status,
              }
            : order
        )
      );

      await loadStats(adminKey);
    } catch (err) {
      console.error(err);
      alert("Gagal terhubung ke server.");
    }
  }

  // =========================
  // CREATE VOUCHER
  // =========================

  async function createVoucher(e) {
    e.preventDefault();

    const code =
      voucherForm.code.trim().toUpperCase();

    const value = Number(
      voucherForm.value
    );

    if (!code) {
      alert("Kode voucher wajib diisi.");
      return;
    }

    if (!value || value <= 0) {
      alert("Nilai diskon harus lebih dari 0.");
      return;
    }

    if (
      voucherForm.type === "percent" &&
      value > 100
    ) {
      alert(
        "Diskon persen tidak boleh lebih dari 100%."
      );
      return;
    }

    try {
      setVoucherLoading(true);

      const response = await fetch(
        BASE_URL + "/api/admin/vouchers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": adminKey,
          },
          body: JSON.stringify({
            code,
            type: voucherForm.type,
            value,
            maxUses:
              voucherForm.maxUses
                ? Number(
                    voucherForm.maxUses
                  )
                : null,
            expiresAt:
              voucherForm.expiresAt
                ? new Date(
                    voucherForm.expiresAt
                  ).toISOString()
                : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Gagal membuat voucher."
        );
      }

      alert(
        "🎟️ Voucher " +
          code +
          " berhasil dibuat!"
      );

      setVoucherForm({
        code: "",
        type: "nominal",
        value: "",
        maxUses: "",
        expiresAt: "",
      });

      await loadVouchers(adminKey);
    } catch (err) {
      console.error(err);
      alert(
        err.message ||
          "Gagal membuat voucher."
      );
    } finally {
      setVoucherLoading(false);
    }
  }

  // =========================
  // TOGGLE VOUCHER
  // =========================

  async function toggleVoucher(voucher) {
    const newActive =
      Number(voucher.active) === 1
        ? false
        : true;

    try {
      const response = await fetch(
        BASE_URL +
          "/api/admin/vouchers/" +
          voucher.id,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": adminKey,
          },
          body: JSON.stringify({
            active: newActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Gagal mengubah voucher."
        );
      }

      await loadVouchers(adminKey);
    } catch (err) {
      console.error(err);
      alert(
        err.message ||
          "Gagal mengubah status voucher."
      );
    }
  }

  // =========================
  // FORMAT
  // =========================

  function formatRp(value) {
    return (
      "Rp " +
      Number(value || 0).toLocaleString(
        "id-ID"
      )
    );
  }

  function getStatusClass(status) {
    if (status === "pending") {
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";
    }

    if (status === "diproses") {
      return "border-blue-500/20 bg-blue-500/10 text-blue-400";
    }

    if (status === "selesai") {
      return "border-green-500/20 bg-green-500/10 text-green-400";
    }

    if (status === "dibatalkan") {
      return "border-red-500/20 bg-red-500/10 text-red-400";
    }

    return "border-slate-700 bg-slate-800 text-slate-300";
  }

  function formatVoucherValue(voucher) {
    if (voucher.type === "percent") {
      return voucher.value + "%";
    }

    return formatRp(voucher.value);
  }

  function formatVoucherExpiry(
    expiresAt
  ) {
    if (!expiresAt) {
      return "Tidak ada batas waktu";
    }

    const date = new Date(expiresAt);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleString("id-ID");
  }

  const filteredOrders = orders.filter(
    (order) => {
      const keyword =
        search.toLowerCase().trim();

      const searchMatch =
        !keyword ||
        String(order.id || "")
          .toLowerCase()
          .includes(keyword) ||
        String(order.username || "")
          .toLowerCase()
          .includes(keyword) ||
        String(order.game || "")
          .toLowerCase()
          .includes(keyword) ||
        String(order.nickname || "")
          .toLowerCase()
          .includes(keyword) ||
        String(order.user_id || "")
          .toLowerCase()
          .includes(keyword) ||
        String(order.whatsapp || "")
          .toLowerCase()
          .includes(keyword);

      const statusMatch =
        filterStatus === "semua" ||
        order.status === filterStatus;

      return searchMatch && statusMatch;
    }
  );

  // =========================
  // LOGIN SCREEN
  // =========================

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
          <div className="w-full rounded-3xl border border-slate-800 bg-slate-900 p-7 shadow-2xl">

            <div className="text-center">
              <div className="text-5xl">
                🛡️
              </div>

              <h1 className="mt-4 text-3xl font-black">
                Admin BarrStore
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Masukkan password admin untuk
                melanjutkan.
              </p>
            </div>

            <form
              onSubmit={handleLogin}
              className="mt-7"
            >
              <label className="mb-2 block text-sm font-bold">
                Password Admin
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(
                    e.target.value
                  );
                  setError("");
                }}
                placeholder="Masukkan password"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
              />

              {error && (
                <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm font-bold text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-5 w-full rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
              >
                {loading
                  ? "⏳ Memeriksa..."
                  : "🔐 Login Admin"}
              </button>
            </form>

            <button
              onClick={onBack}
              className="mt-3 w-full rounded-xl border border-slate-700 px-5 py-3 font-bold text-slate-300 transition hover:border-slate-500"
            >
              ← Kembali
            </button>

          </div>
        </div>
      </div>
    );
  }

  // =========================
  // ADMIN DASHBOARD
  // =========================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <header className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5">

          <div>
            <h1 className="text-2xl font-black">
              Barr
              <span className="text-cyan-400">
                Store
              </span>{" "}
              Admin
            </h1>

            <p className="text-sm text-slate-500">
              Dashboard & pengelolaan pesanan
            </p>
          </div>

          <div className="flex gap-2">

            <button
              onClick={refreshData}
              disabled={loading}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold transition hover:border-cyan-400 hover:text-cyan-400 disabled:opacity-50"
            >
              {loading
                ? "⏳"
                : "🔄"}{" "}
              Refresh
            </button>

            <button
              onClick={onBack}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold transition hover:border-cyan-400 hover:text-cyan-400"
            >
              ← Toko
            </button>

            <button
              onClick={logout}
              className="rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-400"
            >
              Logout
            </button>

          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">

        {/* =========================
            DASHBOARD
        ========================= */}

        <section className="mb-8">

          <div className="mb-5">
            <h2 className="text-2xl font-black">
              📊 Dashboard
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Ringkasan aktivitas BarrStore
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-500">
                  Total Pesanan
                </p>

                <span className="text-2xl">
                  📦
                </span>
              </div>

              <p className="mt-3 text-3xl font-black text-cyan-400">
                {stats.totalOrders}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-500">
                  Total Pelanggan
                </p>

                <span className="text-2xl">
                  👥
                </span>
              </div>

              <p className="mt-3 text-3xl font-black text-purple-400">
                {stats.totalUsers}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-500">
                  Total Omzet
                </p>

                <span className="text-2xl">
                  💰
                </span>
              </div>

              <p className="mt-3 text-2xl font-black text-green-400">
                {formatRp(
                  stats.totalOmzet
                )}
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Dari pesanan selesai
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-500">
                  Pesanan Selesai
                </p>

                <span className="text-2xl">
                  ✅
                </span>
              </div>

              <p className="mt-3 text-3xl font-black text-green-400">
                {stats.selesai}
              </p>
            </div>

          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
              <p className="text-sm font-bold text-yellow-400">
                ⏳ Pending
              </p>

              <p className="mt-2 text-3xl font-black text-yellow-400">
                {stats.pending}
              </p>
            </div>

            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
              <p className="text-sm font-bold text-blue-400">
                🔄 Diproses
              </p>

              <p className="mt-2 text-3xl font-black text-blue-400">
                {stats.diproses}
              </p>
            </div>

            <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
              <p className="text-sm font-bold text-green-400">
                ✅ Selesai
              </p>

              <p className="mt-2 text-3xl font-black text-green-400">
                {stats.selesai}
              </p>
            </div>

            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
              <p className="text-sm font-bold text-red-400">
                ❌ Dibatalkan
              </p>

              <p className="mt-2 text-3xl font-black text-red-400">
                {stats.dibatalkan}
              </p>
            </div>

          </div>

        </section>

        {/* =========================
            VOUCHER MANAGEMENT
        ========================= */}

        <section className="mb-8 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">

          <div className="border-b border-slate-800 p-5">
            <h2 className="text-xl font-black">
              🎟️ Kelola Voucher
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Buat kode voucher yang bisa
              digunakan pelanggan di toko.
            </p>
          </div>

          {/* FORM BUAT VOUCHER */}

          <div className="border-b border-slate-800 p-5">

            <form
              onSubmit={createVoucher}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            >

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Kode Voucher
                </label>

                <input
                  type="text"
                  value={voucherForm.code}
                  onChange={(e) =>
                    setVoucherForm(
                      (prev) => ({
                        ...prev,
                        code: e.target.value.toUpperCase(),
                      })
                    )
                  }
                  placeholder="Contoh: BARR10"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-bold uppercase outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Jenis Diskon
                </label>

                <select
                  value={voucherForm.type}
                  onChange={(e) =>
                    setVoucherForm(
                      (prev) => ({
                        ...prev,
                        type: e.target.value,
                      })
                    )
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-bold outline-none focus:border-cyan-400"
                >
                  <option value="nominal">
                    💰 Potongan Nominal
                  </option>

                  <option value="percent">
                    📊 Persentase
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Nilai Diskon
                </label>

                <input
                  type="number"
                  min="1"
                  value={voucherForm.value}
                  onChange={(e) =>
                    setVoucherForm(
                      (prev) => ({
                        ...prev,
                        value: e.target.value,
                      })
                    )
                  }
                  placeholder={
                    voucherForm.type ===
                    "percent"
                      ? "Contoh: 10"
                      : "Contoh: 10000"
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                />

                <p className="mt-1 text-xs text-slate-500">
                  {voucherForm.type ===
                  "percent"
                    ? "10 = diskon 10%"
                    : "10000 = potongan Rp10.000"}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Maksimal Penggunaan
                </label>

                <input
                  type="number"
                  min="1"
                  value={voucherForm.maxUses}
                  onChange={(e) =>
                    setVoucherForm(
                      (prev) => ({
                        ...prev,
                        maxUses:
                          e.target.value,
                      })
                    )
                  }
                  placeholder="Kosongkan jika unlimited"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Tanggal Expired
                </label>

                <input
                  type="datetime-local"
                  value={
                    voucherForm.expiresAt
                  }
                  onChange={(e) =>
                    setVoucherForm(
                      (prev) => ({
                        ...prev,
                        expiresAt:
                          e.target.value,
                      })
                    )
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-cyan-400"
                />

                <p className="mt-1 text-xs text-slate-500">
                  Kosongkan jika tidak expired.
                </p>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={voucherLoading}
                  className="w-full rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
                >
                  {voucherLoading
                    ? "⏳ Membuat..."
                    : "🎟️ Buat Voucher"}
                </button>
              </div>

            </form>

          </div>

          {/* LIST VOUCHER */}

          <div className="p-5">

            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-black">
                  📋 Daftar Voucher
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {vouchers.length} voucher
                  tersedia di database.
                </p>
              </div>

              <button
                onClick={() =>
                  loadVouchers(adminKey)
                }
                className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-bold transition hover:border-cyan-400 hover:text-cyan-400"
              >
                🔄 Refresh Voucher
              </button>
            </div>

            {vouchers.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center">

                <div className="text-4xl">
                  🎟️
                </div>

                <p className="mt-3 font-bold text-slate-400">
                  Belum ada voucher.
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  Buat voucher pertama lu di
                  form atas.
                </p>

              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">

                {vouchers.map(
                  (voucher) => (
                    <div
                      key={voucher.id}
                      className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div>
                          <div className="flex flex-wrap items-center gap-2">

                            <span className="rounded-lg bg-cyan-400/10 px-3 py-1 font-black tracking-wider text-cyan-400">
                              {voucher.code}
                            </span>

                            <span
                              className={
                                Number(
                                  voucher.active
                                ) === 1
                                  ? "rounded-lg border border-green-500/20 bg-green-500/10 px-2 py-1 text-xs font-bold text-green-400"
                                  : "rounded-lg border border-red-500/20 bg-red-500/10 px-2 py-1 text-xs font-bold text-red-400"
                              }
                            >
                              {Number(
                                voucher.active
                              ) === 1
                                ? "AKTIF"
                                : "NONAKTIF"}
                            </span>

                          </div>

                          <p className="mt-4 text-2xl font-black text-white">
                            {formatVoucherValue(
                              voucher
                            )}
                          </p>

                          <p className="mt-2 text-sm text-slate-500">
                            Dipakai:{" "}
                            <span className="font-bold text-slate-300">
                              {voucher.used_count ||
                                0}
                            </span>

                            {voucher.max_uses ? (
                              <>
                                {" "}
                                /{" "}
                                <span className="font-bold text-slate-300">
                                  {
                                    voucher.max_uses
                                  }
                                </span>
                              </>
                            ) : (
                              " / Unlimited"
                            )}
                          </p>

                          <p className="mt-1 text-xs text-slate-600">
                            Expired:{" "}
                            {formatVoucherExpiry(
                              voucher.expires_at
                            )}
                          </p>

                        </div>

                        <button
                          onClick={() =>
                            toggleVoucher(
                              voucher
                            )
                          }
                          className={
                            Number(
                              voucher.active
                            ) === 1
                              ? "rounded-xl border border-red-500/30 px-3 py-2 text-xs font-black text-red-400 transition hover:bg-red-500/10"
                              : "rounded-xl border border-green-500/30 px-3 py-2 text-xs font-black text-green-400 transition hover:bg-green-500/10"
                          }
                        >
                          {Number(
                            voucher.active
                          ) === 1
                            ? "🔴 Matikan"
                            : "🟢 Aktifkan"}
                        </button>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </div>

        </section>

        {/* =========================
            ORDERS
        ========================= */}

        <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">

          <div className="border-b border-slate-800 p-5">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <h2 className="text-xl font-black">
                  📦 Daftar Pesanan
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Menampilkan{" "}
                  {filteredOrders.length} dari{" "}
                  {orders.length} pesanan
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="🔎 Cari pesanan..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-cyan-400 sm:w-72"
                />

                <select
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(
                      e.target.value
                    )
                  }
                  className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-bold outline-none focus:border-cyan-400"
                >
                  <option value="semua">
                    Semua Status
                  </option>

                  <option value="pending">
                    Pending
                  </option>

                  <option value="diproses">
                    Diproses
                  </option>

                  <option value="selesai">
                    Selesai
                  </option>

                  <option value="dibatalkan">
                    Dibatalkan
                  </option>
                </select>

              </div>

            </div>

          </div>

          {filteredOrders.length ===
          0 ? (
            <div className="p-12 text-center">

              <div className="text-5xl">
                📭
              </div>

              <p className="mt-4 font-bold text-slate-400">
                {orders.length === 0
                  ? "Belum ada pesanan."
                  : "Pesanan tidak ditemukan."}
              </p>

              {orders.length > 0 && (
                <button
                  onClick={() => {
                    setSearch("");
                    setFilterStatus(
                      "semua"
                    );
                  }}
                  className="mt-4 rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold transition hover:border-cyan-400 hover:text-cyan-400"
                >
                  Reset Filter
                </button>
              )}

            </div>
          ) : (
            <div className="divide-y divide-slate-800">

              {filteredOrders.map(
                (order) => (
                  <div
                    key={order.id}
                    className="p-5 transition hover:bg-slate-800/30"
                  >

                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="text-lg font-black">
                            #{order.id}
                          </span>

                          <span className="rounded-lg bg-cyan-400/10 px-2 py-1 text-xs font-bold text-cyan-400">
                            {order.service}
                          </span>

                          <span
                            className={
                              "rounded-lg border px-2 py-1 text-xs font-bold " +
                              getStatusClass(
                                order.status
                              )
                            }
                          >
                            {order.status}
                          </span>

                        </div>

                        <p className="mt-3 text-lg font-black">
                          {order.game}
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          {order.nominal ||
                            "-"}
                        </p>

                        {Number(
                          order.discount || 0
                        ) > 0 && (
                          <div className="mt-2 text-sm">
                            <span className="text-slate-500 line-through">
                              {formatRp(
                                Number(
                                  order.price ||
                                    0
                                ) +
                                  Number(
                                    order.discount ||
                                      0
                                  )
                              )}
                            </span>

                            <span className="ml-2 font-bold text-green-400">
                              🎟️ Diskon{" "}
                              {formatRp(
                                order.discount
                              )}
                            </span>
                          </div>
                        )}

                        <p className="mt-2 text-xl font-black text-cyan-400">
                          {formatRp(
                            order.price
                          )}
                        </p>

                        {order.voucher_code && (
                          <p className="mt-1 text-xs font-bold text-purple-400">
                            🎟️ Voucher:{" "}
                            {
                              order.voucher_code
                            }
                          </p>
                        )}

                        {order.username && (
                          <p className="mt-2 text-sm text-purple-400">
                            👤 Customer:{" "}
                            <span className="font-bold">
                              {
                                order.username
                              }
                            </span>
                          </p>
                        )}

                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm xl:min-w-[300px]">

                        <p className="font-black">
                          👤{" "}
                          {order.nickname ||
                            "Tanpa nickname"}
                        </p>

                        <p className="mt-2 text-slate-400">
                          ID:{" "}
                          {order.user_id ||
                            "-"}
                        </p>

                        <p className="text-slate-400">
                          Server:{" "}
                          {order.server_id ||
                            "-"}
                        </p>

                        <p className="mt-2 font-bold text-green-400">
                          📱 WA:{" "}
                          {order.whatsapp ||
                            "-"}
                        </p>

                      </div>

                    </div>

                    {order.note && (
                      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-400">
                        📝 {order.note}
                      </div>
                    )}

                    <div className="mt-5 flex flex-wrap gap-2">

                      <button
                        onClick={() =>
                          updateStatus(
                            order.id,
                            "pending"
                          )
                        }
                        className="rounded-lg border border-yellow-500/30 px-3 py-2 text-xs font-bold text-yellow-400 transition hover:bg-yellow-500/10"
                      >
                        ⏳ Pending
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(
                            order.id,
                            "diproses"
                          )
                        }
                        className="rounded-lg border border-blue-500/30 px-3 py-2 text-xs font-bold text-blue-400 transition hover:bg-blue-500/10"
                      >
                        🔄 Diproses
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(
                            order.id,
                            "selesai"
                          )
                        }
                        className="rounded-lg border border-green-500/30 px-3 py-2 text-xs font-bold text-green-400 transition hover:bg-green-500/10"
                      >
                        ✅ Selesai
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(
                            order.id,
                            "dibatalkan"
                          )
                        }
                        className="rounded-lg border border-red-500/30 px-3 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500/10"
                      >
                        ❌ Batalkan
                      </button>

                      {order.whatsapp && (
                        <a
                          href={
                            "https://wa.me/" +
                            order.whatsapp
                              .replace(
                                /\D/g,
                                ""
                              )
                              .replace(
                                /^0/,
                                "62"
                              )
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg bg-green-500 px-3 py-2 text-xs font-black text-white transition hover:bg-green-400"
                        >
                          💬 Chat WhatsApp
                        </a>
                      )}

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default Admin;