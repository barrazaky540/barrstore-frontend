import { useEffect, useMemo, useState } from "react";

function Admin({ API_URL, onBack }) {
  const BASE_URL =
    API_URL || "https://barrstore-backend-bhjj.vercel.app";

  // =========================
  // AUTH
  // =========================

  const [adminKey, setAdminKey] = useState(
    sessionStorage.getItem("barrstore_admin_key") || ""
  );

  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // ORDERS
  // =========================

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");

  // =========================
  // STATS
  // =========================

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalOmzet: 0,
    pending: 0,
    diproses: 0,
    selesai: 0,
    dibatalkan: 0,
  });

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

  // =========================
  // AUTO REFRESH
  // =========================

  useEffect(() => {
    if (!loggedIn || !adminKey) return;

    const interval = setInterval(() => {
      refreshData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [loggedIn, adminKey]);

  // =========================
  // LOGIN CHECK
  // =========================

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

      setOrders(Array.isArray(data) ? data : []);
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
  // LOAD STATS
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

      if (!response.ok) return;

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

      if (!response.ok) return;

      const data = await response.json();

      if (data.success) {
        setVouchers(data.vouchers || []);
      }
    } catch (err) {
      console.error("VOUCHER ERROR:", err);
    }
  }

  // =========================
  // REFRESH DATA
  // =========================

  async function refreshData(silent = false) {
    try {
      if (!silent) setLoading(true);

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

      setOrders(Array.isArray(data) ? data : []);

      await loadStats(adminKey);
      await loadVouchers(adminKey);
    } catch (err) {
      console.error(err);

      if (!silent) {
        alert("Gagal memperbarui data.");
      }
    } finally {
      if (!silent) setLoading(false);
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
  // UPDATE STATUS
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
      alert(
        "Nilai diskon harus lebih dari 0."
      );
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

  function formatVoucherExpiry(expiresAt) {
    if (!expiresAt) {
      return "Tidak ada batas waktu";
    }

    const date = new Date(expiresAt);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleString("id-ID");
  }

  // =========================
  // DATE HELPER
  // =========================

  function getOrderDate(order) {
    const raw =
      order.created_at ||
      order.createdAt ||
      order.date ||
      order.created ||
      order.timestamp ||
      order.updated_at ||
      order.updatedAt;

    if (!raw) return null;

    const date = new Date(raw);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date;
  }

  // =========================
  // FILTER ORDER
  // =========================

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
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
    });
  }, [orders, search, filterStatus]);

  // =========================
  // DASHBOARD DATA
  // =========================

  const dashboardData = useMemo(() => {
    const today = new Date();

    const isSameDay = (a, b) => {
      return (
        a.getFullYear() ===
          b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
      );
    };

    // =========================
    // OMZET HARI INI
    // =========================

    const omzetHariIni = orders
      .filter((order) => {
        const date = getOrderDate(order);

        return (
          date &&
          isSameDay(date, today) &&
          order.status === "selesai"
        );
      })
      .reduce(
        (total, order) =>
          total +
          Number(order.price || 0),
        0
      );

    // =========================
    // GAME TERLARIS
    // =========================

    const gameMap = {};

    orders.forEach((order) => {
      const game =
        order.game ||
        order.service ||
        "Lainnya";

      gameMap[game] =
        (gameMap[game] || 0) + 1;
    });

    const topGames = Object.entries(
      gameMap
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // =========================
    // SERVICE TERLARIS
    // =========================

    const serviceMap = {};

    orders.forEach((order) => {
      const service =
        order.service || "Lainnya";

      serviceMap[service] =
        (serviceMap[service] || 0) + 1;
    });

    const topServices = Object.entries(
      serviceMap
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // =========================
    // RATING
    // =========================

    const ratings = orders
      .map((order) => {
        const value =
          order.rating ??
          order.review_rating ??
          order.reviewRating ??
          order.stars;

        const number = Number(value);

        if (
          Number.isFinite(number) &&
          number >= 1 &&
          number <= 5
        ) {
          return number;
        }

        return null;
      })
      .filter(
        (value) => value !== null
      );

    const averageRating =
      ratings.length > 0
        ? ratings.reduce(
            (a, b) => a + b,
            0
          ) / ratings.length
        : 0;

    // =========================
    // REVIEWS
    // =========================

    const reviews = orders
      .filter((order) => {
        return Boolean(
          order.review ||
            order.ulasan ||
            order.comment
        );
      })
      .sort((a, b) => {
        const dateA =
          getOrderDate(a)?.getTime() || 0;

        const dateB =
          getOrderDate(b)?.getTime() || 0;

        return dateB - dateA;
      })
      .slice(0, 5);

    // =========================
    // RECENT ORDERS
    // =========================

    const recentOrders = [...orders]
      .sort((a, b) => {
        const dateA =
          getOrderDate(a)?.getTime() || 0;

        const dateB =
          getOrderDate(b)?.getTime() || 0;

        if (dateA === dateB) {
          return (
            Number(b.id || 0) -
            Number(a.id || 0)
          );
        }

        return dateB - dateA;
      })
      .slice(0, 5);

    // =========================
    // 7 DAYS CHART
    // =========================

    const chartDays = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();

      date.setHours(0, 0, 0, 0);
      date.setDate(
        date.getDate() - i
      );

      const dayOrders = orders.filter(
        (order) => {
          const orderDate =
            getOrderDate(order);

          return (
            orderDate &&
            order.status === "selesai" &&
            isSameDay(
              orderDate,
              date
            )
          );
        }
      );

      const omzet = dayOrders.reduce(
        (total, order) =>
          total +
          Number(order.price || 0),
        0
      );

      chartDays.push({
        date,
        label: date.toLocaleDateString(
          "id-ID",
          {
            weekday: "short",
          }
        ),
        shortDate:
          date.toLocaleDateString(
            "id-ID",
            {
              day: "2-digit",
              month: "2-digit",
            }
          ),
        omzet,
        orders: dayOrders.length,
      });
    }

    return {
      omzetHariIni,
      topGames,
      topServices,
      averageRating,
      ratingCount: ratings.length,
      reviews,
      recentOrders,
      chartDays,
    };
  }, [orders]);

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

      {/* HEADER */}

      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">

          <div>
            <h1 className="text-2xl font-black">
              Barr
              <span className="text-cyan-400">
                Store
              </span>{" "}
              Admin
            </h1>

            <p className="text-xs text-slate-500">
              Dashboard & pengelolaan toko
            </p>
          </div>

          <div className="flex gap-2">

            <button
              onClick={() =>
                refreshData(false)
              }
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
              className="hidden rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold transition hover:border-cyan-400 hover:text-cyan-400 sm:block"
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

        {/* DASHBOARD TITLE */}

        <section className="mb-8">

          <div className="mb-6">
            <h2 className="text-3xl font-black">
              📊 Dashboard
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Ringkasan aktivitas BarrStore
            </p>
          </div>

          {/* MAIN STATS */}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <StatCard
              title="Total Pesanan"
              value={stats.totalOrders}
              icon="📦"
              textClass="text-cyan-400"
            />

            <StatCard
              title="Total Pelanggan"
              value={stats.totalUsers}
              icon="👥"
              textClass="text-purple-400"
            />

            <StatCard
              title="Total Omzet"
              value={formatRp(
                stats.totalOmzet
              )}
              icon="💰"
              textClass="text-green-400"
              small
            />

            <StatCard
              title="Omzet Hari Ini"
              value={formatRp(
                dashboardData.omzetHariIni
              )}
              icon="📈"
              textClass="text-amber-400"
              small
            />

          </div>

          {/* STATUS */}

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <MiniStat
              title="Pending"
              value={stats.pending}
              icon="⏳"
              className="border-yellow-500/20 bg-yellow-500/5 text-yellow-400"
            />

            <MiniStat
              title="Diproses"
              value={stats.diproses}
              icon="🔄"
              className="border-blue-500/20 bg-blue-500/5 text-blue-400"
            />

            <MiniStat
              title="Selesai"
              value={stats.selesai}
              icon="✅"
              className="border-green-500/20 bg-green-500/5 text-green-400"
            />

            <MiniStat
              title="Dibatalkan"
              value={stats.dibatalkan}
              icon="❌"
              className="border-red-500/20 bg-red-500/5 text-red-400"
            />

          </div>

        </section>

        {/* SVG SALES CHART */}

        <section className="mb-8 rounded-3xl border border-slate-800 bg-slate-900 p-5">

          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-xl font-black">
                📈 Grafik Omzet
              </h2>

              <p className="text-sm text-slate-500">
                Omzet pesanan selesai selama 7 hari terakhir
              </p>
            </div>

            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-3 py-2 text-xs font-bold text-cyan-400">
              SVG LIVE DATA
            </div>

          </div>

          <SalesChart
            data={dashboardData.chartDays}
            formatRp={formatRp}
          />

        </section>

        {/* BEST SELLERS */}

        <section className="mb-8 grid gap-6 lg:grid-cols-2">

          {/* GAME TERLARIS */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">

            <div className="mb-5">
              <h2 className="text-xl font-black">
                🏆 Game Paling Laku
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Berdasarkan jumlah pesanan
              </p>
            </div>

            {dashboardData.topGames.length ===
            0 ? (
              <EmptySmall text="Belum ada data game." />
            ) : (
              <div className="space-y-4">
                {dashboardData.topGames.map(
                  ([game, count], index) => {
                    const max =
                      dashboardData.topGames[0][1];

                    const percentage =
                      max > 0
                        ? (count / max) * 100
                        : 0;

                    return (
                      <div key={game}>

                        <div className="mb-2 flex items-center justify-between gap-3">

                          <div className="flex min-w-0 items-center gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-sm font-black">
                              {index + 1}
                            </span>

                            <span className="truncate font-bold">
                              {game}
                            </span>
                          </div>

                          <span className="shrink-0 text-sm font-black text-cyan-400">
                            {count} order
                          </span>

                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-cyan-400 transition-all"
                            style={{
                              width:
                                percentage +
                                "%",
                            }}
                          />
                        </div>

                      </div>
                    );
                  }
                )}
              </div>
            )}

          </div>

          {/* SERVICE TERLARIS */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">

            <div className="mb-5">
              <h2 className="text-xl font-black">
                🛒 Layanan Paling Laku
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Top Up, Joki, Akun, dan layanan lainnya
              </p>
            </div>

            {dashboardData.topServices.length ===
            0 ? (
              <EmptySmall text="Belum ada data layanan." />
            ) : (
              <div className="space-y-4">
                {dashboardData.topServices.map(
                  ([service, count], index) => {
                    const max =
                      dashboardData.topServices[0][1];

                    const percentage =
                      max > 0
                        ? (count / max) * 100
                        : 0;

                    return (
                      <div key={service}>

                        <div className="mb-2 flex items-center justify-between gap-3">

                          <div className="flex min-w-0 items-center gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-sm font-black">
                              {index + 1}
                            </span>

                            <span className="truncate font-bold capitalize">
                              {service}
                            </span>
                          </div>

                          <span className="shrink-0 text-sm font-black text-purple-400">
                            {count} order
                          </span>

                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-purple-400 transition-all"
                            style={{
                              width:
                                percentage +
                                "%",
                            }}
                          />
                        </div>

                      </div>
                    );
                  }
                )}
              </div>
            )}

          </div>

        </section>

        {/* RATING + REVIEW */}

        <section className="mb-8 grid gap-6 lg:grid-cols-3">

          {/* RATING */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5">

            <h2 className="text-xl font-black">
              ⭐ Rating Customer
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Berdasarkan rating yang tersimpan di pesanan
            </p>

            <div className="mt-8 text-center">

              <div className="text-5xl font-black text-amber-400">
                {dashboardData.averageRating
                  ? dashboardData.averageRating.toFixed(
                      1
                    )
                  : "—"}
              </div>

              <div className="mt-2 text-2xl tracking-widest text-amber-400">
                {renderStars(
                  dashboardData.averageRating
                )}
              </div>

              <p className="mt-3 text-sm text-slate-500">
                {dashboardData.ratingCount} ulasan
              </p>

            </div>

          </div>

          {/* REVIEW */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 lg:col-span-2">

            <div className="mb-5">
              <h2 className="text-xl font-black">
                💬 Review Customer
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review terbaru dari pelanggan
              </p>
            </div>

            {dashboardData.reviews.length ===
            0 ? (
              <EmptySmall text="Belum ada review yang tersimpan." />
            ) : (
              <div className="grid gap-3 md:grid-cols-2">

                {dashboardData.reviews.map(
                  (review) => {
                    const rating =
                      Number(
                        review.rating ??
                          review.review_rating ??
                          review.reviewRating ??
                          review.stars ??
                          0
                      );

                    const text =
                      review.review ||
                      review.ulasan ||
                      review.comment ||
                      "";

                    return (
                      <div
                        key={review.id}
                        className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
                      >

                        <div className="flex items-center justify-between gap-3">

                          <p className="font-black">
                            👤{" "}
                            {review.username ||
                              review.nickname ||
                              "Customer"}
                          </p>

                          <span className="text-sm text-amber-400">
                            {renderStars(
                              rating
                            )}
                          </span>

                        </div>

                        <p className="mt-3 text-sm leading-6 text-slate-400">
                          "{text}"
                        </p>

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </div>

        </section>

        {/* RECENT ORDERS */}

        <section className="mb-8 rounded-3xl border border-slate-800 bg-slate-900">

          <div className="border-b border-slate-800 p-5">

            <div className="flex items-center justify-between gap-3">

              <div>
                <h2 className="text-xl font-black">
                  📋 Pesanan Terbaru
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  5 pesanan terakhir
                </p>
              </div>

              <button
                onClick={() => {
                  document
                    .getElementById(
                      "orders-section"
                    )
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                }}
                className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold transition hover:border-cyan-400 hover:text-cyan-400"
              >
                Lihat Semua
              </button>

            </div>

          </div>

          {dashboardData.recentOrders.length ===
          0 ? (
            <EmptySmall text="Belum ada pesanan." />
          ) : (
            <div className="divide-y divide-slate-800">

              {dashboardData.recentOrders.map(
                (order) => (
                  <div
                    key={order.id}
                    className="flex flex-col gap-3 p-4 transition hover:bg-slate-800/30 sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="font-black">
                          #{order.id}
                        </span>

                        <span className="rounded-lg bg-cyan-400/10 px-2 py-1 text-xs font-bold text-cyan-400">
                          {order.service ||
                            "Order"}
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

                      <p className="mt-2 truncate font-bold">
                        {order.game ||
                          "Layanan BarrStore"}
                      </p>

                      <p className="text-xs text-slate-500">
                        {order.username ||
                          order.nickname ||
                          "Customer"}
                      </p>

                    </div>

                    <div className="text-left sm:text-right">

                      <p className="font-black text-cyan-400">
                        {formatRp(
                          order.price
                        )}
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        {getOrderDate(
                          order
                        )
                          ? getOrderDate(
                              order
                            ).toLocaleString(
                              "id-ID"
                            )
                          : "Tanggal tidak tersedia"}
                      </p>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </section>

        {/* VOUCHER MANAGEMENT */}

        <section className="mb-8 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900">

          <div className="border-b border-slate-800 p-5">

            <h2 className="text-xl font-black">
              🎟️ Kelola Voucher
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Buat dan aktifkan voucher pelanggan.
            </p>

          </div>

          {/* FORM */}

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
                  tersedia.
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
              <EmptySmall text="Belum ada voucher." />
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

                          <p className="mt-4 text-2xl font-black">
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
                                {" / "}
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

        {/* ALL ORDERS */}

        <section
          id="orders-section"
          className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900"
        >

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

          {filteredOrders.length === 0 ? (
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
                            {order.service ||
                              "Order"}
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

                        {getOrderDate(
                          order
                        ) && (
                          <p className="mt-2 text-xs text-slate-600">
                            🕒{" "}
                            {getOrderDate(
                              order
                            ).toLocaleString(
                              "id-ID"
                            )}
                          </p>
                        )}

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

// =====================================================
// STAT CARD
// =====================================================

function StatCard({
  title,
  value,
  icon,
  textClass,
  small = false,
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <div className="flex items-center justify-between">

        <p className="text-sm font-bold text-slate-500">
          {title}
        </p>

        <span className="text-2xl">
          {icon}
        </span>

      </div>

      <p
        className={
          "mt-3 font-black " +
          (small
            ? "text-xl"
            : "text-3xl") +
          " " +
          textClass
        }
      >
        {value}
      </p>

    </div>
  );
}

// =====================================================
// MINI STAT
// =====================================================

function MiniStat({
  title,
  value,
  icon,
  className,
}) {
  return (
    <div
      className={
        "rounded-2xl border p-5 " +
        className
      }
    >
      <p className="text-sm font-bold">
        {icon} {title}
      </p>

      <p className="mt-2 text-3xl font-black">
        {value}
      </p>
    </div>
  );
}

// =====================================================
// EMPTY
// =====================================================

function EmptySmall({ text }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center">

      <div className="text-4xl">
        📭
      </div>

      <p className="mt-3 text-sm font-bold text-slate-500">
        {text}
      </p>

    </div>
  );
}

// =====================================================
// SVG SALES CHART
// =====================================================

function SalesChart({
  data,
  formatRp,
}) {
  const width = 900;
  const height = 340;

  const paddingLeft = 65;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 55;

  const chartWidth =
    width -
    paddingLeft -
    paddingRight;

  const chartHeight =
    height -
    paddingTop -
    paddingBottom;

  const maxValue = Math.max(
    ...data.map(
      (item) => item.omzet
    ),
    1
  );

  const points = data.map(
    (item, index) => {
      const x =
        paddingLeft +
        (index /
          Math.max(
            data.length - 1,
            1
          )) *
          chartWidth;

      const y =
        paddingTop +
        chartHeight -
        (item.omzet / maxValue) *
          chartHeight;

      return {
        ...item,
        x,
        y,
      };
    }
  );

  // FIX: dibuat tanpa nested template literal
  // supaya Vite tidak error saat parsing JSX.

  const linePath = points
    .map((point, index) => {
      const command =
        index === 0 ? "M" : "L";

      return (
        command +
        " " +
        point.x +
        " " +
        point.y
      );
    })
    .join(" ");

  const areaPath =
    points.length > 0
      ? linePath +
        " L " +
        points[points.length - 1].x +
        " " +
        (paddingTop +
          chartHeight) +
        " L " +
        points[0].x +
        " " +
        (paddingTop +
          chartHeight) +
        " Z"
      : "";

  const gridValues = [
    maxValue,
    maxValue * 0.75,
    maxValue * 0.5,
    maxValue * 0.25,
    0,
  ];

  return (
    <div className="w-full overflow-x-auto">

      <div className="min-w-[700px]">

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full"
          role="img"
          aria-label="Grafik omzet 7 hari"
        >

          {/* GRID */}

          {gridValues.map(
            (value, index) => {
              const y =
                paddingTop +
                (index / 4) *
                  chartHeight;

              return (
                <g key={index}>

                  <line
                    x1={paddingLeft}
                    x2={
                      width -
                      paddingRight
                    }
                    y1={y}
                    y2={y}
                    stroke="currentColor"
                    strokeOpacity="0.1"
                    strokeDasharray="5 5"
                  />

                  <text
                    x={paddingLeft - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-slate-500 text-[11px]"
                  >
                    {formatCompactRp(
                      value
                    )}
                  </text>

                </g>
              );
            }
          )}

          {/* AREA */}

          {areaPath && (
            <path
              d={areaPath}
              fill="currentColor"
              fillOpacity="0.06"
              className="text-cyan-400"
            />
          )}

          {/* LINE */}

          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-cyan-400"
            />
          )}

          {/* POINTS */}

          {points.map(
            (point, index) => (
              <g key={index}>

                <circle
                  cx={point.x}
                  cy={point.y}
                  r="7"
                  className="fill-slate-900 stroke-cyan-400"
                  strokeWidth="3"
                />

                <circle
                  cx={point.x}
                  cy={point.y}
                  r="3"
                  className="fill-cyan-400"
                />

                <text
                  x={point.x}
                  y={
                    point.y - 15
                  }
                  textAnchor="middle"
                  className="fill-slate-300 text-[10px] font-bold"
                >
                  {formatCompactRp(
                    point.omzet
                  )}
                </text>

                <text
                  x={point.x}
                  y={
                    height - 25
                  }
                  textAnchor="middle"
                  className="fill-slate-500 text-[11px] font-bold"
                >
                  {point.label}
                </text>

                <text
                  x={point.x}
                  y={
                    height - 10
                  }
                  textAnchor="middle"
                  className="fill-slate-700 text-[9px]"
                >
                  {point.shortDate}
                </text>

              </g>
            )
          )}

        </svg>

      </div>

    </div>
  );
}

// =====================================================
// COMPACT RP
// =====================================================

function formatCompactRp(value) {
  const number = Number(value || 0);

  if (number >= 1000000000) {
    return (
      "Rp " +
      (number / 1000000000).toFixed(1) +
      "M"
    );
  }

  if (number >= 1000000) {
    return (
      "Rp " +
      (number / 1000000).toFixed(1) +
      "jt"
    );
  }

  if (number >= 1000) {
    return (
      "Rp " +
      (number / 1000).toFixed(0) +
      "rb"
    );
  }

  return "Rp " + number;
}

// =====================================================
// STARS
// =====================================================

function renderStars(rating) {
  const rounded = Math.round(
    Number(rating || 0)
  );

  return [1, 2, 3, 4, 5]
    .map((star) =>
      star <= rounded ? "★" : "☆"
    )
    .join("");
}

export default Admin;