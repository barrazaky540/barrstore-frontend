import { useEffect, useState } from "react";
import {
  GAMES,
  NOMINALS,
  JOKI_GAMES,
  JOKI_PRICE_PER_TIER,
  AKUN_LIST,
  formatRp,
} from "./data";
import Admin from "./Admin";

const API_URL = "https://barrstore-backend-bhjj.vercel.app";

function App() {
  // =========================
  // LOGIN USER
  // =========================

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("barrstore_user");

    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState("");

  // =========================
  // PESANAN USER
  // =========================

  const [showOrders, setShowOrders] = useState(false);
  const [myOrders, setMyOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // =========================
  // RATING & REVIEW
  // =========================

  const [showRating, setShowRating] = useState(false);
  const [ratingOrder, setRatingOrder] = useState(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingText, setRatingText] = useState("");
  const [ratingLoading, setRatingLoading] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  // =========================
  // SERVICE
  // =========================

  const [service, setService] = useState("topup");

  const [selectedGame, setSelectedGame] = useState("ml");
  const [selectedNominal, setSelectedNominal] = useState("");

  const [selectedJokiGame, setSelectedJokiGame] = useState("ml");
  const [currentRank, setCurrentRank] = useState("");
  const [selectedRank, setSelectedRank] = useState("");

  const [nickname, setNickname] = useState("");
  const [userId, setUserId] = useState("");
  const [serverId, setServerId] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [note, setNote] = useState("");

  // DATA LOGIN JOKI
  const [jokiEmail, setJokiEmail] = useState("");
  const [jokiPassword, setJokiPassword] = useState("");

  const [selectedAccount, setSelectedAccount] = useState(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const [paymentData, setPaymentData] = useState(null);

  // =========================
  // VOUCHER
  // =========================

  const [voucherCode, setVoucherCode] = useState("");
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [voucherResult, setVoucherResult] = useState(null);
  const [voucherError, setVoucherError] = useState("");

  function resetVoucher() {
    setVoucherCode("");
    setVoucherResult(null);
    setVoucherError("");
  }

  async function applyVoucher(price) {
    const code = voucherCode.trim().toUpperCase();

    if (!code) {
      setVoucherError("Masukkan kode voucher terlebih dahulu.");
      setVoucherResult(null);
      return;
    }

    if (!price || Number(price) <= 0) {
      setVoucherError("Pilih produk terlebih dahulu.");
      return;
    }

    try {
      setVoucherLoading(true);
      setVoucherError("");
      setVoucherResult(null);

      const response = await fetch(
        API_URL + "/api/vouchers/check",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            price: Number(price),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Voucher tidak valid."
        );
      }

      setVoucherCode(code);
      setVoucherResult({
        originalPrice: Number(
          data.originalPrice ?? price
        ),
        discount: Number(data.discount || 0),
        finalPrice: Number(
          data.finalPrice ?? price
        ),
        voucher: data.voucher || {
          code,
        },
      });

      setMessage(
        "🎟️ Voucher " +
          code +
          " berhasil digunakan!"
      );
    } catch (error) {
      console.error(error);

      setVoucherResult(null);
      setVoucherError(
        error.message ||
          "Gagal mengecek voucher."
      );
    } finally {
      setVoucherLoading(false);
    }
  }

  function getDiscountedPrice(price) {
    const numericPrice = Number(price || 0);

    if (
      voucherResult &&
      Number(voucherResult.originalPrice) ===
        numericPrice
    ) {
      return Number(
        voucherResult.finalPrice
      );
    }

    return numericPrice;
  }

  function getCurrentVoucherCode(price) {
    const numericPrice = Number(price || 0);

    if (
      voucherResult &&
      Number(voucherResult.originalPrice) ===
        numericPrice
    ) {
      return (
        voucherResult.voucher?.code ||
        voucherCode ||
        null
      );
    }

    return null;
  }

  // =========================
  // LOGIN / REGISTER
  // =========================

  function openLogin() {
    setAuthMode("login");
    setAuthUsername("");
    setAuthPassword("");
    setAuthMessage("");
    setShowAuth(true);
  }

  function openRegister() {
    setAuthMode("register");
    setAuthUsername("");
    setAuthPassword("");
    setAuthMessage("");
    setShowAuth(true);
  }

  async function handleAuth(e) {
    e.preventDefault();

    if (!authUsername.trim()) {
      setAuthMessage("Username wajib diisi.");
      return;
    }

    if (!authPassword.trim()) {
      setAuthMessage("Password wajib diisi.");
      return;
    }

    if (authPassword.length < 4) {
      setAuthMessage("Password minimal 4 karakter.");
      return;
    }

    try {
      setAuthLoading(true);
      setAuthMessage("");

      const endpoint =
        authMode === "login"
          ? "/api/login"
          : "/api/users";

      const response = await fetch(
        API_URL + endpoint,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: authUsername.trim(),
            password: authPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Terjadi kesalahan."
        );
      }

      if (authMode === "register") {
        setAuthMessage(
          "✅ Registrasi berhasil! Silakan login."
        );

        setAuthMode("login");
        setAuthPassword("");
        return;
      }

      const loggedUser = data.user;

      localStorage.setItem(
        "barrstore_user",
        JSON.stringify(loggedUser)
      );

      setUser(loggedUser);
      setShowAuth(false);
      setAuthUsername("");
      setAuthPassword("");
      setAuthMessage("");

      setMessage(
        "👋 Selamat datang, " +
          loggedUser.username +
          "!"
      );
    } catch (error) {
      console.error(error);

      setAuthMessage(
        error.message ||
          "Gagal terhubung ke server."
      );
    } finally {
      setAuthLoading(false);
    }
  }

  function logoutUser() {
    localStorage.removeItem("barrstore_user");

    setUser(null);
    setMyOrders([]);
    setShowOrders(false);

    setMessage("✅ Kamu berhasil logout.");
  }

  // =========================
  // PESANAN SAYA
  // =========================

  async function loadMyOrders() {
    if (!user?.username) {
      openLogin();
      return;
    }

    try {
      setOrdersLoading(true);

      const response = await fetch(
        API_URL +
          "/api/users/" +
          encodeURIComponent(user.username) +
          "/orders?t=" +
          Date.now(),
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Gagal mengambil pesanan."
        );
      }

      setMyOrders(data.orders || []);
      setShowOrders(true);
    } catch (error) {
      console.error(error);

      setMessage(
        error.message ||
          "Gagal mengambil riwayat pesanan."
      );
    } finally {
      setOrdersLoading(false);
    }
  }

  // =========================
  // LOAD REVIEW
  // =========================

  async function loadReviews() {
    try {
      setReviewsLoading(true);

      const response = await fetch(
        API_URL +
          "/api/reviews?t=" +
          Date.now(),
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Gagal mengambil review."
        );
      }

      setReviews(data.reviews || []);
      setAverageRating(
        Number(data.averageRating || 0)
      );
      setTotalReviews(
        Number(data.totalReviews || 0)
      );
    } catch (error) {
      console.error(
        "LOAD REVIEW ERROR:",
        error
      );
    } finally {
      setReviewsLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, []);

  // =========================
  // RATING
  // =========================

  function openRating(order) {
    if (!order) return;

    setRatingOrder(order);
    setRatingValue(
      Number(order.rating || 5)
    );
    setRatingText(
      order.review || ""
    );
    setShowRating(true);
  }

  function closeRating() {
    if (ratingLoading) return;

    setShowRating(false);
    setRatingOrder(null);
    setRatingValue(5);
    setRatingText("");
  }

  async function submitRating() {
    if (!user?.username) {
      openLogin();
      return;
    }

    if (!ratingOrder?.id) {
      setMessage(
        "Pesanan tidak ditemukan."
      );
      return;
    }

    const rating = Number(ratingValue);
    const review = ratingText.trim();

    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      setMessage(
        "Rating harus antara 1 sampai 5."
      );
      return;
    }

    if (review.length > 500) {
      setMessage(
        "Ulasan maksimal 500 karakter."
      );
      return;
    }

    try {
      setRatingLoading(true);
      setMessage("");

      const response = await fetch(
        API_URL +
          "/api/orders/" +
          ratingOrder.id +
          "/review",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: user.username,
            rating,
            review,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Gagal mengirim rating."
        );
      }

      setShowRating(false);
      setRatingOrder(null);
      setRatingValue(5);
      setRatingText("");

      await loadMyOrders();
      await loadReviews();

      setMessage(
        "⭐ Terima kasih! Rating dan ulasan kamu berhasil dikirim."
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error.message ||
          "Gagal mengirim rating."
      );
    } finally {
      setRatingLoading(false);
    }
  }

  // =========================
  // AUTO UPDATE STATUS PESANAN
  // =========================

  useEffect(() => {
    if (!user?.username || !showOrders) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          API_URL +
            "/api/users/" +
            encodeURIComponent(user.username) +
            "/orders?t=" +
            Date.now(),
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (data.orders) {
          setMyOrders(data.orders);
        }
      } catch (error) {
        console.error(
          "AUTO UPDATE ERROR:",
          error
        );
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [user?.username, showOrders]);

  // =========================
  // CREATE ORDER
  // =========================

  async function createOrder(orderData) {
    if (!user) {
      setPaymentData(null);
      openLogin();

      setMessage(
        "🔐 Silakan login terlebih dahulu sebelum membuat pesanan."
      );

      return false;
    }

    try {
      setLoading(true);
      setMessage("");

      const finalOrderData = {
        ...orderData,
        username: user.username,
      };

      const response = await fetch(
        API_URL + "/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalOrderData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Gagal membuat pesanan"
        );
      }

      setPaymentData(null);

      resetVoucher();

      setMessage(
        "✅ Pembayaran berhasil! Pesanan #" +
          data.orderId +
          " berhasil dibuat — Status: pending"
      );

      return true;
    } catch (error) {
      console.error(error);

      setMessage(
        error.message ||
          "Terjadi kesalahan saat membuat pesanan."
      );

      return false;
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // PAYMENT
  // =========================

  function openPayment(orderData) {
    if (!user) {
      openLogin();

      setMessage(
        "🔐 Login terlebih dahulu untuk melanjutkan pembayaran."
      );

      return;
    }

    setMessage("");
    setPaymentData(orderData);
  }

  async function confirmPayment() {
    if (!paymentData) return;

    await createOrder(paymentData);
  }

  function closePayment() {
    if (loading) return;

    setPaymentData(null);
  }

  // =========================
  // TOP UP
  // =========================

  function handleTopup() {
    if (!user) {
      openLogin();

      setMessage(
        "🔐 Login terlebih dahulu sebelum melakukan top up."
      );

      return;
    }

    const game = GAMES.find(
      (item) => item.id === selectedGame
    );

    const nominal = NOMINALS[selectedGame]?.find(
      (item) =>
        item.label === selectedNominal
    );

    if (!game) {
      setMessage("Game belum dipilih.");
      return;
    }

    if (!nominal) {
      setMessage("Nominal belum dipilih.");
      return;
    }

    if (!userId.trim()) {
      setMessage("User ID wajib diisi.");
      return;
    }

    if (!whatsapp.trim()) {
      setMessage("Nomor WhatsApp wajib diisi.");
      return;
    }

    const originalPrice =
      Number(nominal.price);

    const finalPrice =
      getDiscountedPrice(originalPrice);

    const appliedVoucher =
      getCurrentVoucherCode(
        originalPrice
      );

    openPayment({
      service: "topup",
      game: game.name,
      nominal: nominal.label,
      price: finalPrice,
      originalPrice,
      discount:
        originalPrice - finalPrice,
      voucherCode: appliedVoucher,
      nickname: nickname.trim(),
      userId: userId.trim(),
      serverId: serverId.trim(),
      whatsapp: whatsapp.trim(),
      note: note.trim(),
    });
  }

  // =========================
  // JOKI
  // =========================

  function handleJoki() {
    if (!user) {
      openLogin();

      setMessage(
        "🔐 Login terlebih dahulu sebelum menggunakan jasa joki."
      );

      return;
    }

    const game = JOKI_GAMES.find(
      (item) => item.id === selectedJokiGame
    );

    const ranks = game?.ranks || [];

    const currentRankIndex =
      ranks.indexOf(currentRank);

    const selectedRankIndex =
      ranks.indexOf(selectedRank);

    if (!game) {
      setMessage("Game belum dipilih.");
      return;
    }

    if (!currentRank) {
      setMessage(
        "Rank saat ini wajib dipilih."
      );

      return;
    }

    if (!selectedRank) {
      setMessage(
        "Target rank wajib dipilih."
      );

      return;
    }

    if (
      selectedRankIndex <=
      currentRankIndex
    ) {
      setMessage(
        "Target rank harus lebih tinggi dari rank saat ini."
      );

      return;
    }

    if (!jokiEmail.trim()) {
      setMessage(
        "Email / Username akun wajib diisi."
      );

      return;
    }

    if (!jokiPassword.trim()) {
      setMessage(
        "Password akun wajib diisi."
      );

      return;
    }

    if (!whatsapp.trim()) {
      setMessage(
        "Nomor WhatsApp wajib diisi."
      );

      return;
    }

    const tierDifference =
      selectedRankIndex -
      currentRankIndex;

    const basePrice =
      JOKI_PRICE_PER_TIER[
        selectedJokiGame
      ] || 10000;

    const originalPrice =
      tierDifference * basePrice;

    const finalPrice =
      getDiscountedPrice(
        originalPrice
      );

    const appliedVoucher =
      getCurrentVoucherCode(
        originalPrice
      );

    openPayment({
      service: "joki",
      game: game.name,
      nominal:
        currentRank +
        " → " +
        selectedRank,
      price: finalPrice,
      originalPrice,
      discount:
        originalPrice - finalPrice,
      voucherCode: appliedVoucher,
      nickname: nickname.trim(),
      userId: userId.trim(),
      serverId: serverId.trim(),
      whatsapp: whatsapp.trim(),
      note:
        note.trim() +
        " | Login akun: " +
        jokiEmail.trim(),
    });
  }

  // =========================
  // AKUN
  // =========================

  function handleAkun() {
    if (!user) {
      openLogin();

      setMessage(
        "🔐 Login terlebih dahulu sebelum membeli akun."
      );

      return;
    }

    if (!selectedAccount) {
      setMessage(
        "Pilih akun terlebih dahulu."
      );

      return;
    }

    if (!whatsapp.trim()) {
      setMessage(
        "Nomor WhatsApp wajib diisi."
      );

      return;
    }

    const originalPrice =
      Number(selectedAccount.price);

    const finalPrice =
      getDiscountedPrice(
        originalPrice
      );

    const appliedVoucher =
      getCurrentVoucherCode(
        originalPrice
      );

    openPayment({
      service: "akun",
      game: selectedAccount.game,
      nominal:
        selectedAccount.rank +
        " - Lv." +
        selectedAccount.level,
      price: finalPrice,
      originalPrice,
      discount:
        originalPrice - finalPrice,
      voucherCode: appliedVoucher,
      nickname: nickname.trim(),
      whatsapp: whatsapp.trim(),
      note: note.trim(),
    });
  }

  // =========================
  // JOKI PRICE
  // =========================

  const currentJokiGame =
    JOKI_GAMES.find(
      (game) =>
        game.id === selectedJokiGame
    );

  const ranks =
    currentJokiGame?.ranks || [];

  const currentRankIndex =
    ranks.indexOf(currentRank);

  const targetRanks =
    currentRankIndex >= 0
      ? ranks.filter(
          (_, index) =>
            index > currentRankIndex
        )
      : [];

  const selectedRankIndex =
    ranks.indexOf(selectedRank);

  const tierDifference =
    currentRankIndex >= 0 &&
    selectedRankIndex >= 0
      ? selectedRankIndex -
        currentRankIndex
      : 0;

  const jokiBasePrice =
    JOKI_PRICE_PER_TIER[
      selectedJokiGame
    ] || 10000;

  const jokiPrice =
    tierDifference > 0
      ? tierDifference *
        jokiBasePrice
      : 0;

  const jokiFinalPrice =
    getDiscountedPrice(jokiPrice);

  // =========================
  // ADMIN
  // =========================

  if (showAdmin) {
    return (
      <Admin
        API_URL={API_URL}
        onBack={() =>
          setShowAdmin(false)
        }
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* HEADER */}

      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur">

        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">

          <div>
            <h1 className="text-2xl font-black">
              Barr
              <span className="text-cyan-400">
                Store
              </span>
            </h1>

            <p className="text-xs text-slate-500">
              Top Up • Joki • Akun Game
            </p>
          </div>

          <div className="flex flex-wrap justify-end gap-2">

            {user ? (
              <>
                <button
                  onClick={loadMyOrders}
                  disabled={ordersLoading}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-bold transition hover:border-cyan-400 hover:text-cyan-400 disabled:opacity-50"
                >
                  {ordersLoading
                    ? "⏳"
                    : "📦 Pesanan Saya"}
                </button>

                <div className="hidden items-center rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm md:flex">
                  👤{" "}
                  <span className="ml-1 font-black text-cyan-400">
                    {user.username}
                  </span>
                </div>

                <button
                  onClick={logoutUser}
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-bold text-red-400 transition hover:bg-red-500/20"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={openLogin}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-bold transition hover:border-cyan-400 hover:text-cyan-400"
                >
                  🔐 Login
                </button>

                <button
                  onClick={openRegister}
                  className="rounded-xl bg-cyan-400 px-3 py-2 text-sm font-black text-slate-950 transition hover:bg-cyan-300"
                >
                  📝 Daftar
                </button>
              </>
            )}

            <button
              onClick={() =>
                setShowAdmin(true)
              }
              className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-bold transition hover:border-cyan-400 hover:text-cyan-400"
            >
              🛡️ Admin
            </button>

          </div>

        </div>

      </header>

      {/* MAIN */}

      <main className="mx-auto max-w-6xl px-4 py-8">

        {/* HERO */}

        <section className="mb-8 rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8">

          <p className="text-sm font-bold text-cyan-400">
            BARRSTORE
          </p>

          <h2 className="mt-2 text-3xl font-black md:text-5xl">
            Gaming lebih gampang.
          </h2>

          <p className="mt-3 max-w-2xl text-slate-400">
            Top up game, joki rank, dan jual beli akun
            dengan proses yang simpel dan cepat.
          </p>

          {user && (
            <div className="mt-5 inline-flex rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-300">
              👋 Login sebagai {user.username}
            </div>
          )}

        </section>

        {/* SERVICE */}

        <div className="mb-6 grid grid-cols-3 gap-2 rounded-2xl border border-slate-800 bg-slate-900 p-2">

          <button
            onClick={() => {
              setService("topup");
              setMessage("");
              resetVoucher();
            }}
            className={
              "rounded-xl px-4 py-3 text-sm font-black transition " +
              (
                service === "topup"
                  ? "bg-cyan-400 text-slate-950"
                  : "text-slate-400 hover:text-white"
              )
            }
          >
            💎 Top Up
          </button>

          <button
            onClick={() => {
              setService("joki");
              setMessage("");
              resetVoucher();
            }}
            className={
              "rounded-xl px-4 py-3 text-sm font-black transition " +
              (
                service === "joki"
                  ? "bg-cyan-400 text-slate-950"
                  : "text-slate-400 hover:text-white"
              )
            }
          >
            🏆 Joki
          </button>

          <button
            onClick={() => {
              setService("akun");
              setMessage("");
              resetVoucher();
            }}
            className={
              "rounded-xl px-4 py-3 text-sm font-black transition " +
              (
                service === "akun"
                  ? "bg-cyan-400 text-slate-950"
                  : "text-slate-400 hover:text-white"
              )
            }
          >
            🎮 Akun
          </button>

        </div>

        {/* ========================= */}
        {/* TOP UP */}
        {/* ========================= */}

        {service === "topup" && (
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 md:p-7">

            <h3 className="text-2xl font-black">
              Top Up Game
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Pilih game dan nominal yang ingin dibeli.
            </p>

            <div className="mt-6">

              <label className="mb-3 block text-sm font-bold">
                Pilih Game
              </label>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

                {GAMES.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => {
                      setSelectedGame(game.id);
                      setSelectedNominal("");
                      resetVoucher();
                    }}
                    className={
                      "rounded-2xl border p-4 text-left transition " +
                      (
                        selectedGame === game.id
                          ? "border-cyan-400 bg-cyan-400/10"
                          : "border-slate-700 bg-slate-950 hover:border-slate-500"
                      )
                    }
                  >

                    <div className="text-2xl">
                      {game.icon}
                    </div>

                    <div className="mt-2 text-sm font-bold">
                      {game.name}
                    </div>

                  </button>
                ))}

              </div>

            </div>

            <div className="mt-6">

              <label className="mb-2 block text-sm font-bold">
                Nominal
              </label>

              <select
                value={selectedNominal}
                onChange={(e) => {
                  setSelectedNominal(
                    e.target.value
                  );
                  resetVoucher();
                }}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              >

                <option value="">
                  Pilih nominal
                </option>

                {NOMINALS[selectedGame]?.map(
                  (item) => (
                    <option
                      key={item.label}
                      value={item.label}
                    >
                      {item.label} —{" "}
                      {formatRp(item.price)}
                    </option>
                  )
                )}

              </select>

            </div>

            <CustomerForm
              nickname={nickname}
              setNickname={setNickname}
              userId={userId}
              setUserId={setUserId}
              serverId={serverId}
              setServerId={setServerId}
              whatsapp={whatsapp}
              setWhatsapp={setWhatsapp}
              note={note}
              setNote={setNote}
            />

            {selectedNominal && (
              <VoucherBox
                code={voucherCode}
                setCode={setVoucherCode}
                loading={voucherLoading}
                result={voucherResult}
                error={voucherError}
                onApply={() => {
                  const nominal =
                    NOMINALS[selectedGame]?.find(
                      (item) =>
                        item.label ===
                        selectedNominal
                    );

                  applyVoucher(
                    nominal?.price || 0
                  );
                }}
              />
            )}

            <OrderButton
              loading={loading}
              onClick={handleTopup}
              text="💳 Lanjut ke Pembayaran"
            />

          </section>
        )}

        {/* ========================= */}
        {/* JOKI */}
        {/* ========================= */}

        {service === "joki" && (
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 md:p-7">

            <h3 className="text-2xl font-black">
              Joki Rank
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Pilih game, rank saat ini, dan target rank.
            </p>

            <div className="mt-6">

              <label className="mb-3 block text-sm font-bold">
                Pilih Game
              </label>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

                {JOKI_GAMES.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => {
                      setSelectedJokiGame(game.id);
                      setCurrentRank("");
                      setSelectedRank("");
                      resetVoucher();
                    }}
                    className={
                      "rounded-2xl border p-4 text-left transition " +
                      (
                        selectedJokiGame === game.id
                          ? "border-cyan-400 bg-cyan-400/10"
                          : "border-slate-700 bg-slate-950 hover:border-slate-500"
                      )
                    }
                  >

                    <div className="text-2xl">
                      {game.icon}
                    </div>

                    <div className="mt-2 text-sm font-bold">
                      {game.name}
                    </div>

                  </button>
                ))}

              </div>

            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-bold">
                  Rank Saat Ini
                </label>

                <select
                  value={currentRank}
                  onChange={(e) => {
                    setCurrentRank(
                      e.target.value
                    );
                    setSelectedRank("");
                    resetVoucher();
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                >

                  <option value="">
                    Pilih rank saat ini
                  </option>

                  {ranks.map((rank) => (
                    <option
                      key={rank}
                      value={rank}
                    >
                      {rank}
                    </option>
                  ))}

                </select>

              </div>

              <div>

                <label className="mb-2 block text-sm font-bold">
                  Target Rank
                </label>

                <select
                  value={selectedRank}
                  onChange={(e) => {
                    setSelectedRank(
                      e.target.value
                    );
                    resetVoucher();
                  }}
                  disabled={!currentRank}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none disabled:opacity-50 focus:border-cyan-400"
                >

                  <option value="">
                    Pilih target rank
                  </option>

                  {targetRanks.map((rank) => (
                    <option
                      key={rank}
                      value={rank}
                    >
                      {rank}
                    </option>
                  ))}

                </select>

              </div>

            </div>

            <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5">

              <div className="flex items-center justify-between">

                <span className="text-sm text-slate-400">
                  Estimasi harga
                </span>

                <div className="text-right">

                  {voucherResult &&
                    voucherResult.originalPrice ===
                      jokiPrice && (
                      <p className="text-xs text-slate-500 line-through">
                        {formatRp(
                          jokiPrice
                        )}
                      </p>
                    )}

                  <span className="text-2xl font-black text-cyan-400">
                    {formatRp(
                      jokiFinalPrice
                    )}
                  </span>

                </div>

              </div>

              {tierDifference > 0 && (
                <p className="mt-2 text-xs text-slate-500">
                  {tierDifference} tier ×{" "}
                  {formatRp(jokiBasePrice)}
                </p>
              )}

            </div>

            <CustomerForm
              nickname={nickname}
              setNickname={setNickname}
              userId={userId}
              setUserId={setUserId}
              serverId={serverId}
              setServerId={setServerId}
              whatsapp={whatsapp}
              setWhatsapp={setWhatsapp}
              note={note}
              setNote={setNote}
              jokiMode
              jokiEmail={jokiEmail}
              setJokiEmail={setJokiEmail}
              jokiPassword={jokiPassword}
              setJokiPassword={setJokiPassword}
            />

            {jokiPrice > 0 && (
              <VoucherBox
                code={voucherCode}
                setCode={setVoucherCode}
                loading={voucherLoading}
                result={voucherResult}
                error={voucherError}
                onApply={() =>
                  applyVoucher(jokiPrice)
                }
              />
            )}

            <OrderButton
              loading={loading}
              onClick={handleJoki}
              text="💳 Lanjut ke Pembayaran"
            />

          </section>
        )}

        {/* ========================= */}
        {/* AKUN */}
        {/* ========================= */}

        {service === "akun" && (
          <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5 md:p-7">

            <h3 className="text-2xl font-black">
              Jual / Beli Akun
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Pilih akun game yang tersedia.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

              {AKUN_LIST.map((akun) => (
                <button
                  key={akun.id}
                  onClick={() => {
                    setSelectedAccount(akun);
                    resetVoucher();
                  }}
                  className={
                    "rounded-2xl border p-5 text-left transition " +
                    (
                      selectedAccount?.id ===
                      akun.id
                        ? "border-cyan-400 bg-cyan-400/10"
                        : "border-slate-700 bg-slate-950 hover:border-slate-500"
                    )
                  }
                >

                  <div className="flex items-start justify-between gap-3">

                    <div>

                      <p className="text-xs font-bold uppercase text-cyan-400">
                        {akun.game}
                      </p>

                      <h4 className="mt-1 text-lg font-black">
                        {akun.rank}
                      </h4>

                    </div>

                    <span className="rounded-lg bg-slate-800 px-2 py-1 text-xs font-bold">
                      Lv. {akun.level}
                    </span>

                  </div>

                  <p className="mt-4 text-sm text-slate-400">
                    {akun.note}
                  </p>

                  <p className="mt-4 text-xl font-black text-cyan-400">
                    {formatRp(akun.price)}
                  </p>

                </button>
              ))}

            </div>

            <CustomerForm
              nickname={nickname}
              setNickname={setNickname}
              userId={userId}
              setUserId={setUserId}
              serverId={serverId}
              setServerId={setServerId}
              whatsapp={whatsapp}
              setWhatsapp={setWhatsapp}
              note={note}
              setNote={setNote}
              accountMode
            />

            {selectedAccount && (
              <VoucherBox
                code={voucherCode}
                setCode={setVoucherCode}
                loading={voucherLoading}
                result={voucherResult}
                error={voucherError}
                onApply={() =>
                  applyVoucher(
                    selectedAccount.price
                  )
                }
              />
            )}

            <OrderButton
              loading={loading}
              onClick={handleAkun}
              text="💳 Lanjut ke Pembayaran"
            />

          </section>
        )}

        {/* ========================= */}
        {/* REVIEW PUBLIK */}
        {/* ========================= */}

        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-5 md:p-7">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-sm font-bold text-cyan-400">
                CUSTOMER REVIEW
              </p>

              <h3 className="mt-1 text-2xl font-black">
                ⭐ Review Customer
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Lihat pengalaman customer BarrStore.
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 px-5 py-4 text-center">

              <div className="text-2xl font-black text-yellow-400">
                ⭐{" "}
                {averageRating > 0
                  ? averageRating.toFixed(1)
                  : "0.0"}
              </div>

              <p className="mt-1 text-xs font-bold text-slate-500">
                {totalReviews} review
                {totalReviews !== 1
                  ? "s"
                  : ""}
              </p>

            </div>

          </div>

          {reviewsLoading ? (
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center">

              <div className="text-3xl">
                ⏳
              </div>

              <p className="mt-2 text-sm font-bold text-slate-500">
                Memuat review...
              </p>

            </div>
          ) : reviews.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center">

              <div className="text-4xl">
                💬
              </div>

              <p className="mt-3 font-bold text-slate-400">
                Belum ada review.
              </p>

              <p className="mt-1 text-sm text-slate-600">
                Jadilah customer pertama yang memberikan rating!
              </p>

            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

              {reviews.slice(0, 6).map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div>

                      <p className="font-black text-white">
                        👤 {review.username}
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        {review.game} •{" "}
                        {review.service}
                      </p>

                    </div>

                    <div className="text-sm">
                      {Array.from({
                        length: 5,
                      }).map((_, index) => (
                        <span
                          key={index}
                          className={
                            index <
                            Number(
                              review.rating
                            )
                              ? "text-yellow-400"
                              : "text-slate-700"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>

                  </div>

                  {review.review ? (
                    <p className="mt-4 rounded-xl bg-slate-900 p-3 text-sm leading-relaxed text-slate-400">
                      "{review.review}"
                    </p>
                  ) : (
                    <p className="mt-4 text-sm italic text-slate-600">
                      Customer memberikan rating tanpa ulasan.
                    </p>
                  )}

                </div>
              ))}

            </div>
          )}

        </section>

        {/* MESSAGE */}

        {message && (
          <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm font-bold text-cyan-300">
            {message}
          </div>
        )}

      </main>

      {/* FOOTER */}

      <footer className="border-t border-slate-800 py-8 text-center">

        <p className="text-sm text-slate-500">
          © 2027 BarrStore — Top Up, Joki & Akun Game
        </p>

      </footer>

      {/* ========================= */}
      {/* LOGIN REGISTER MODAL */}
      {/* ========================= */}

      {showAuth && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">

            <div className="text-center">

              <div className="text-5xl">
                {authMode === "login"
                  ? "🔐"
                  : "📝"}
              </div>

              <h2 className="mt-3 text-2xl font-black">
                {authMode === "login"
                  ? "Login BarrStore"
                  : "Daftar BarrStore"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {authMode === "login"
                  ? "Login untuk melakukan pesanan."
                  : "Buat akun untuk mulai menggunakan BarrStore."}
              </p>

            </div>

            <form
              onSubmit={handleAuth}
              className="mt-6"
            >

              <Input
                label="Username"
                value={authUsername}
                onChange={setAuthUsername}
                placeholder="Masukkan username"
              />

              <div className="mt-4">

                <label className="mb-2 block text-sm font-bold">
                  Password
                </label>

                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => {
                    setAuthPassword(
                      e.target.value
                    );
                    setAuthMessage("");
                  }}
                  placeholder="Masukkan password"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-cyan-400"
                />

              </div>

              {authMessage && (
                <div className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-sm font-bold text-cyan-300">
                  {authMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="mt-5 w-full rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
              >
                {authLoading
                  ? "⏳ Memproses..."
                  : authMode === "login"
                    ? "🔐 Login"
                    : "📝 Daftar"}
              </button>

            </form>

            <div className="mt-4 text-center text-sm text-slate-500">

              {authMode === "login" ? (
                <>
                  Belum punya akun?{" "}
                  <button
                    onClick={() => {
                      setAuthMode(
                        "register"
                      );
                      setAuthMessage("");
                      setAuthPassword("");
                    }}
                    className="font-black text-cyan-400 hover:text-cyan-300"
                  >
                    Daftar sekarang
                  </button>
                </>
              ) : (
                <>
                  Sudah punya akun?{" "}
                  <button
                    onClick={() => {
                      setAuthMode("login");
                      setAuthMessage("");
                      setAuthPassword("");
                    }}
                    className="font-black text-cyan-400 hover:text-cyan-300"
                  >
                    Login
                  </button>
                </>
              )}

            </div>

            <button
              onClick={() => {
                if (!authLoading) {
                  setShowAuth(false);
                  setAuthMessage("");
                }
              }}
              disabled={authLoading}
              className="mt-4 w-full rounded-xl border border-slate-700 px-5 py-3 font-bold text-slate-300 transition hover:border-slate-500 disabled:opacity-50"
            >
              ← Tutup
            </button>

          </div>

        </div>
      )}

      {/* ========================= */}
      {/* PESANAN SAYA MODAL */}
      {/* ========================= */}

      {showOrders && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">

            <div className="flex items-center justify-between gap-4">

              <div>

                <h2 className="text-2xl font-black">
                  📦 Pesanan Saya
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Riwayat pesanan akun {user?.username}
                </p>

              </div>

              <button
                onClick={() =>
                  setShowOrders(false)
                }
                className="rounded-xl border border-slate-700 px-3 py-2 font-bold text-slate-300 hover:border-slate-500"
              >
                ✕
              </button>

            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">

              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-green-400"></span>

              Status diperbarui otomatis setiap 5 detik

            </div>

            {myOrders.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center">

                <div className="text-5xl">
                  📭
                </div>

                <p className="mt-3 font-bold text-slate-400">
                  Belum ada pesanan.
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  Pesanan kamu akan muncul di sini.
                </p>

              </div>
            ) : (
              <div className="mt-6 space-y-4">

                {myOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                  >

                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                      <div>

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="text-lg font-black">
                            #{order.id}
                          </span>

                          <span className="rounded-lg bg-cyan-400/10 px-2 py-1 text-xs font-bold text-cyan-400">
                            {order.service}
                          </span>

                          <OrderStatus
                            status={order.status}
                          />

                        </div>

                        <p className="mt-3 font-black">
                          {order.game}
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          {order.nominal || "-"}
                        </p>

                      </div>

                      <div className="text-right">

                        {Number(order.discount || 0) > 0 && (
                          <p className="text-xs text-slate-500">
                            Diskon: -{" "}
                            {formatRp(
                              Number(
                                order.discount
                              )
                            )}
                          </p>
                        )}

                        <p className="text-xl font-black text-cyan-400">
                          {formatRp(
                            Number(
                              order.price || 0
                            )
                          )}
                        </p>

                      </div>

                    </div>

                    {order.voucher_code && (
                      <div className="mt-4 inline-flex rounded-xl border border-green-400/20 bg-green-400/10 px-3 py-2 text-xs font-black text-green-400">
                        🎟️ Voucher:{" "}
                        {order.voucher_code}
                      </div>
                    )}

                    <div className="mt-4 grid gap-2 text-sm text-slate-400 md:grid-cols-2">

                      <p>
                        👤 Nickname:{" "}
                        <span className="font-bold text-white">
                          {order.nickname || "-"}
                        </span>
                      </p>

                      <p>
                        📱 WhatsApp:{" "}
                        <span className="font-bold text-white">
                          {order.whatsapp || "-"}
                        </span>
                      </p>

                      {order.user_id && (
                        <p>
                          🆔 User ID:{" "}
                          <span className="font-bold text-white">
                            {order.user_id}
                          </span>
                        </p>
                      )}

                      {order.server_id && (
                        <p>
                          🌐 Server ID:{" "}
                          <span className="font-bold text-white">
                            {order.server_id}
                          </span>
                        </p>
                      )}

                    </div>

                    {order.note && (
                      <div className="mt-4 rounded-xl bg-slate-900 p-3 text-sm text-slate-400">
                        📝 {order.note}
                      </div>
                    )}

                    {/* RATING PESANAN SELESAI */}

                    {order.status === "selesai" && (
                      <div className="mt-5">

                        {order.rating == null ? (
                          <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-4">

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                              <div>

                                <p className="font-black text-yellow-400">
                                  ⭐ Pesanan selesai!
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  Bagaimana pengalaman kamu menggunakan BarrStore?
                                </p>

                              </div>

                              <button
                                onClick={() =>
                                  openRating(order)
                                }
                                className="rounded-xl bg-yellow-400 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-yellow-300"
                              >
                                ⭐ Beri Rating
                              </button>

                            </div>

                          </div>
                        ) : (
                          <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-4">

                            <p className="text-xs font-bold text-slate-500">
                              Rating kamu
                            </p>

                            <div className="mt-1 text-lg">
                              {Array.from({
                                length: 5,
                              }).map((_, index) => (
                                <span
                                  key={index}
                                  className={
                                    index <
                                    Number(
                                      order.rating
                                    )
                                      ? "text-yellow-400"
                                      : "text-slate-700"
                                  }
                                >
                                  ★
                                </span>
                              ))}
                            </div>

                            {order.review && (
                              <p className="mt-3 rounded-xl bg-slate-900 p-3 text-sm text-slate-400">
                                "{order.review}"
                              </p>
                            )}

                          </div>
                        )}

                      </div>
                    )}

                    <p className="mt-4 text-xs text-slate-600">
                      Pesanan dibuat:{" "}
                      {order.created_at || "-"}
                    </p>

                  </div>
                ))}

              </div>
            )}

            <button
              onClick={() =>
                setShowOrders(false)
              }
              className="mt-5 w-full rounded-xl border border-slate-700 px-5 py-3 font-bold text-slate-300 hover:border-slate-500"
            >
              ← Kembali ke Toko
            </button>

          </div>

        </div>
      )}

      {/* ========================= */}
      {/* PAYMENT MODAL */}
      {/* ========================= */}

      {paymentData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">

            <div className="text-center">

              <div className="text-4xl">
                💳
              </div>

              <h2 className="mt-3 text-2xl font-black">
                Pembayaran
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Simulasi pembayaran BarrStore
              </p>

            </div>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-4">

              <div className="flex justify-between gap-4">

                <span className="text-sm text-slate-500">
                  Layanan
                </span>

                <span className="text-sm font-bold capitalize">
                  {paymentData.service}
                </span>

              </div>

              <div className="mt-3 flex justify-between gap-4">

                <span className="text-sm text-slate-500">
                  Game
                </span>

                <span className="text-right text-sm font-bold">
                  {paymentData.game}
                </span>

              </div>

              <div className="mt-3 flex justify-between gap-4">

                <span className="text-sm text-slate-500">
                  Produk
                </span>

                <span className="text-right text-sm font-bold">
                  {paymentData.nominal}
                </span>

              </div>

              {Number(
                paymentData.discount || 0
              ) > 0 && (
                <>
                  <div className="mt-4 flex justify-between gap-4">

                    <span className="text-sm text-slate-500">
                      Harga awal
                    </span>

                    <span className="text-sm font-bold text-slate-400 line-through">
                      {formatRp(
                        paymentData.originalPrice
                      )}
                    </span>

                  </div>

                  <div className="mt-2 flex justify-between gap-4">

                    <span className="text-sm text-slate-500">
                      Diskon
                    </span>

                    <span className="text-sm font-black text-green-400">
                      -{" "}
                      {formatRp(
                        paymentData.discount
                      )}
                    </span>

                  </div>
                </>
              )}

              {paymentData.voucherCode && (
                <div className="mt-3 rounded-xl border border-green-400/20 bg-green-400/10 px-3 py-2 text-xs font-black text-green-400">
                  🎟️{" "}
                  {paymentData.voucherCode}
                </div>
              )}

              <div className="mt-4 border-t border-slate-800 pt-4">

                <div className="flex items-center justify-between">

                  <span className="font-bold">
                    Total Bayar
                  </span>

                  <span className="text-xl font-black text-cyan-400">
                    {formatRp(
                      paymentData.price
                    )}
                  </span>

                </div>

              </div>

            </div>

            {/* QRIS */}

            <div className="mt-5 rounded-2xl border border-slate-700 bg-white p-5 text-center">

              <p className="text-sm font-black text-slate-900">
                QRIS BARRSTORE
              </p>

              <div className="mx-auto mt-4 grid h-48 w-48 grid-cols-9 gap-1 rounded-lg bg-white p-2">

                {Array.from({
                  length: 81,
                }).map((_, index) => {

                  const patterns = [
                    0, 1, 2, 3, 4, 6, 7, 8,
                    9, 13, 17,
                    18, 20, 22, 26,
                    27, 31, 35,
                    36, 37, 39, 40, 42,
                    44, 45, 47,
                    48, 50, 52, 54, 56, 65,
                    57, 58, 60, 62, 64,
                    66, 67, 68, 69, 70,
                    72, 73, 74, 75, 76,
                    77, 78, 79, 80,
                    10, 11, 12, 14, 15, 16,
                    28, 29, 30, 32, 33, 34,
                    41, 43, 46,
                    53, 55, 59, 61, 63,
                    71,
                  ];

                  return (
                    <div
                      key={index}
                      className={
                        patterns.includes(index)
                          ? "rounded-sm bg-black"
                          : "rounded-sm bg-white"
                      }
                    />
                  );
                })}

              </div>

              <p className="mt-3 text-xs font-bold text-slate-700">
                SCAN QRIS UNTUK MEMBAYAR
              </p>

              <p className="mt-1 text-[10px] text-slate-500">
                QRIS ini hanya untuk simulasi demo.
              </p>

            </div>

            <div className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-3 text-center">

              <p className="text-xs font-bold text-yellow-400">
                ⚠️ MODE SIMULASI
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Tidak ada transaksi uang asli.
                Klik tombol di bawah untuk
                mensimulasikan pembayaran berhasil.
              </p>

            </div>

            <button
              onClick={confirmPayment}
              disabled={loading}
              className="mt-5 w-full rounded-xl bg-green-500 px-5 py-4 font-black text-white transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "⏳ Memproses..."
                : "✅ Saya Sudah Bayar"}
            </button>

            <button
              onClick={closePayment}
              disabled={loading}
              className="mt-2 w-full rounded-xl border border-slate-700 px-5 py-3 font-bold text-slate-300 transition hover:border-slate-500 disabled:opacity-50"
            >
              ← Kembali
            </button>

          </div>

        </div>
      )}

      {/* ========================= */}
      {/* RATING MODAL */}
      {/* ========================= */}

      {showRating && ratingOrder && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">

            <div className="text-center">

              <div className="text-5xl">
                ⭐
              </div>

              <h2 className="mt-3 text-2xl font-black">
                Beri Rating
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Bagaimana pengalaman kamu dengan pesanan #{ratingOrder.id}?
              </p>

            </div>

            {/* STAR SELECTOR */}

            <div className="mt-6 text-center">

              <div className="flex justify-center gap-2">

                {Array.from({
                  length: 5,
                }).map((_, index) => {
                  const star =
                    index + 1;

                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setRatingValue(star)
                      }
                      disabled={ratingLoading}
                      className={
                        "text-4xl transition hover:scale-110 " +
                        (
                          star <=
                          Number(
                            ratingValue
                          )
                            ? "text-yellow-400"
                            : "text-slate-700"
                        )
                      }
                    >
                      ★
                    </button>
                  );
                })}

              </div>

              <p className="mt-3 font-black text-yellow-400">
                {ratingValue === 5
                  ? "Sangat puas! 🔥"
                  : ratingValue === 4
                    ? "Puas 👍"
                    : ratingValue === 3
                      ? "Cukup 🙂"
                      : ratingValue === 2
                        ? "Kurang 😕"
                        : "Tidak puas 😭"}
              </p>

            </div>

            {/* REVIEW */}

            <div className="mt-6">

              <label className="mb-2 block text-sm font-bold">
                Ulasan
                <span className="ml-2 text-xs font-normal text-slate-600">
                  Opsional
                </span>
              </label>

              <textarea
                value={ratingText}
                onChange={(e) =>
                  setRatingText(
                    e.target.value.slice(
                      0,
                      500
                    )
                  )
                }
                disabled={ratingLoading}
                placeholder="Ceritakan pengalaman kamu..."
                rows="4"
                maxLength={500}
                className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-yellow-400 disabled:opacity-50"
              />

              <p className="mt-1 text-right text-xs text-slate-600">
                {ratingText.length}/500
              </p>

            </div>

            <button
              onClick={submitRating}
              disabled={ratingLoading}
              className="mt-4 w-full rounded-xl bg-yellow-400 px-5 py-4 font-black text-slate-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {ratingLoading
                ? "⏳ Mengirim..."
                : "⭐ Kirim Rating"}
            </button>

            <button
              onClick={closeRating}
              disabled={ratingLoading}
              className="mt-2 w-full rounded-xl border border-slate-700 px-5 py-3 font-bold text-slate-300 transition hover:border-slate-500 disabled:opacity-50"
            >
              ← Batal
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

// =========================
// VOUCHER BOX
// =========================

function VoucherBox({
  code,
  setCode,
  loading,
  result,
  error,
  onApply,
}) {
  return (
    <div className="mt-6 rounded-2xl border border-purple-400/20 bg-purple-400/5 p-5">

      <div className="flex items-center gap-2">

        <span className="text-xl">
          🎟️
        </span>

        <div>
          <h4 className="font-black">
            Punya Kode Voucher?
          </h4>

          <p className="text-xs text-slate-500">
            Masukkan kode promo untuk mendapatkan diskon.
          </p>
        </div>

      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">

        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(
              e.target.value.toUpperCase()
            );
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onApply();
            }
          }}
          placeholder="Contoh: BARR10"
          className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-bold uppercase outline-none placeholder:text-slate-600 focus:border-purple-400"
        />

        <button
          type="button"
          onClick={onApply}
          disabled={loading}
          className="rounded-xl bg-purple-500 px-5 py-3 font-black text-white transition hover:bg-purple-400 disabled:opacity-50"
        >
          {loading
            ? "⏳ Mengecek..."
            : "🎟️ Gunakan"}
        </button>

      </div>

      {error && (
        <div className="mt-3 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm font-bold text-red-400">
          ❌ {error}
        </div>
      )}

      {result && (
        <div className="mt-4 rounded-xl border border-green-400/20 bg-green-400/10 p-4">

          <div className="flex items-center justify-between gap-3">

            <div>

              <p className="text-xs font-bold text-green-400">
                ✅ VOUCHER BERHASIL
              </p>

              <p className="mt-1 font-black text-white">
                {result.voucher?.code ||
                  code}
              </p>

            </div>

            <span className="rounded-lg bg-green-400/10 px-3 py-2 text-sm font-black text-green-400">
              Hemat{" "}
              {formatRp(
                result.discount
              )}
            </span>

          </div>

          <div className="mt-4 space-y-2 border-t border-green-400/10 pt-3">

            <div className="flex justify-between text-sm">

              <span className="text-slate-500">
                Harga awal
              </span>

              <span className="text-slate-400 line-through">
                {formatRp(
                  result.originalPrice
                )}
              </span>

            </div>

            <div className="flex justify-between text-sm">

              <span className="text-slate-500">
                Diskon
              </span>

              <span className="font-black text-green-400">
                -{" "}
                {formatRp(
                  result.discount
                )}
              </span>

            </div>

            <div className="flex justify-between border-t border-green-400/10 pt-2">

              <span className="font-black">
                Total
              </span>

              <span className="text-lg font-black text-cyan-400">
                {formatRp(
                  result.finalPrice
                )}
              </span>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

// =========================
// CUSTOMER FORM
// =========================

function CustomerForm({
  nickname,
  setNickname,
  userId,
  setUserId,
  serverId,
  setServerId,
  whatsapp,
  setWhatsapp,
  note,
  setNote,
  accountMode = false,
  jokiMode = false,
  jokiEmail,
  setJokiEmail,
  jokiPassword,
  setJokiPassword,
}) {
  return (
    <div className="mt-6">

      <h4 className="mb-4 text-lg font-black">
        Data Pemesan
      </h4>

      <div className="grid gap-4 md:grid-cols-2">

        <Input
          label="Nickname"
          value={nickname}
          onChange={setNickname}
          placeholder="Nickname game"
        />

        {!accountMode && (
          <>
            <Input
              label="User ID"
              value={userId}
              onChange={setUserId}
              placeholder="Masukkan User ID"
            />

            <Input
              label="Server ID"
              value={serverId}
              onChange={setServerId}
              placeholder="Masukkan Server ID"
            />
          </>
        )}

        <Input
          label="WhatsApp"
          value={whatsapp}
          onChange={setWhatsapp}
          placeholder="08xxxxxxxxxx"
        />

      </div>

      {jokiMode && (
        <div className="mt-5 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">

          <div className="mb-4">

            <h4 className="text-base font-black text-yellow-400">
              🔐 Login Akun Untuk Joki
            </h4>

            <p className="mt-1 text-xs text-slate-500">
              Masukkan data login akun yang akan digunakan untuk proses joki.
            </p>

          </div>

          <div className="grid gap-4 md:grid-cols-2">

            <Input
              label="Email / Username Akun"
              value={jokiEmail}
              onChange={setJokiEmail}
              placeholder="Email atau username"
            />

            <div>

              <label className="mb-2 block text-sm font-bold">
                Password Akun
              </label>

              <input
                type="password"
                value={jokiPassword}
                onChange={(e) =>
                  setJokiPassword(
                    e.target.value
                  )
                }
                placeholder="Password akun"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-cyan-400"
              />

            </div>

          </div>

          <p className="mt-3 text-xs text-slate-500">
            🔒 Password hanya digunakan untuk simulasi form dan tidak disimpan ke database.
          </p>

        </div>
      )}

      <div className="mt-4">

        <label className="mb-2 block text-sm font-bold">
          Catatan
        </label>

        <textarea
          value={note}
          onChange={(e) =>
            setNote(e.target.value)
          }
          placeholder="Catatan tambahan..."
          rows="3"
          className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-cyan-400"
        />

      </div>

    </div>
  );
}

// =========================
// INPUT
// =========================

function Input({
  label,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-bold">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-cyan-400"
      />

    </div>
  );
}

// =========================
// ORDER BUTTON
// =========================

function OrderButton({
  loading,
  onClick,
  text,
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-4 font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading
        ? "⏳ Memproses..."
        : text}
    </button>
  );
}

// =========================
// STATUS PESANAN
// =========================

function OrderStatus({ status }) {
  const styles = {
    pending:
      "bg-yellow-400/10 text-yellow-400",
    diproses:
      "bg-blue-400/10 text-blue-400",
    selesai:
      "bg-green-400/10 text-green-400",
    dibatalkan:
      "bg-red-400/10 text-red-400",
  };

  const labels = {
    pending: "⏳ Pending",
    diproses: "🔄 Diproses",
    selesai: "✅ Selesai",
    dibatalkan: "❌ Dibatalkan",
  };

  return (
    <span
      className={
        "rounded-lg px-2 py-1 text-xs font-bold " +
        (styles[status] ||
          "bg-slate-800 text-slate-400")
      }
    >
      {labels[status] || status}
    </span>
  );
}

// =========================
// EXPORT
// =========================

export default App;