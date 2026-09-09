import { useEffect, useMemo, useState } from "react";
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
  const safeGames = Array.isArray(GAMES) ? GAMES : [];
  const safeJokiGames = Array.isArray(JOKI_GAMES)
    ? JOKI_GAMES
    : [];
  const safeAccounts = Array.isArray(AKUN_LIST)
    ? AKUN_LIST
    : [];

  const [service, setService] = useState("topup");
  const [selectedGame, setSelectedGame] = useState(
    safeGames[0]?.id || "ml"
  );

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("barrstore_user") || "null"
      );
    } catch {
      return null;
    }
  });

  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
  });

  const [topupForm, setTopupForm] = useState({
    nominal: "",
    userId: "",
    serverId: "",
    nickname: "",
    whatsapp: "",
    voucher: "",
    note: "",
  });

  const [jokiForm, setJokiForm] = useState({
    currentRank: "",
    targetRank: "",
    email: "",
    password: "",
    whatsapp: "",
    voucher: "",
    note: "",
  });

  const [akunForm, setAkunForm] = useState({
    accountId: "",
    whatsapp: "",
    nickname: "",
    voucher: "",
    note: "",
  });

  const [voucherMessage, setVoucherMessage] = useState("");
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [discount, setDiscount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const [ratingOrder, setRatingOrder] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const currentGame = useMemo(() => {
    return (
      safeGames.find(
        (game) => game && game.id === selectedGame
      ) ||
      safeGames[0] ||
      {
        id: selectedGame,
        name: selectedGame,
      }
    );
  }, [selectedGame]);

  const currentNominals =
    NOMINALS &&
    typeof NOMINALS === "object" &&
    Array.isArray(NOMINALS[selectedGame])
      ? NOMINALS[selectedGame]
      : [];

  /*
   * JOKI:
   * Hanya game yang memang ada di JOKI_GAMES
   * yang dianggap tersedia untuk layanan joki.
   */
  const currentJokiGame =
    safeJokiGames.find(
      (game) => game && game.id === selectedGame
    ) || null;

  const currentRanks = Array.isArray(
    currentJokiGame?.ranks
  )
    ? currentJokiGame.ranks
    : [];

  const isJokiAvailable = !!currentJokiGame;

  const selectedNominal = currentNominals.find(
    (item) => item && item.label === topupForm.nominal
  );

  const selectedAccount = safeAccounts.find(
    (account) =>
      account &&
      String(account.id) ===
        String(akunForm.accountId)
  );

  const currentRankIndex =
    currentRanks.indexOf(jokiForm.currentRank);

  const targetRankIndex =
    currentRanks.indexOf(jokiForm.targetRank);

  const jokiTierDifference =
    currentRankIndex >= 0 &&
    targetRankIndex >= 0 &&
    targetRankIndex > currentRankIndex
      ? targetRankIndex - currentRankIndex
      : 0;

  const jokiPrice =
    jokiTierDifference *
    Number(
      (JOKI_PRICE_PER_TIER &&
        JOKI_PRICE_PER_TIER[selectedGame]) ||
        0
    );

  const basePrice =
    service === "topup"
      ? Number(selectedNominal?.price || 0)
      : service === "joki"
      ? jokiPrice
      : Number(selectedAccount?.price || 0);

  const finalPrice = Math.max(
    0,
    basePrice - discount
  );

  function getTopupConfig() {
    if (selectedGame === "ml") {
      return {
        primaryLabel: "User ID",
        primaryPlaceholder: "Contoh: 12345678",
        secondaryLabel: "Server ID",
        secondaryPlaceholder: "Contoh: 1234",
        secondaryVisible: true,
        primarySummaryLabel: "User ID",
        secondarySummaryLabel: "Server ID",
      };
    }

    if (selectedGame === "genshin") {
      return {
        primaryLabel: "UID",
        primaryPlaceholder: "Contoh: 800123456",
        secondaryLabel: "Server Region",
        secondaryPlaceholder: "Pilih server",
        secondaryVisible: true,
        primarySummaryLabel: "UID",
        secondarySummaryLabel: "Server",
      };
    }

    if (selectedGame === "valo") {
      return {
        primaryLabel: "Riot ID",
        primaryPlaceholder: "Contoh: Barra#1234",
        secondaryLabel: "",
        secondaryPlaceholder: "",
        secondaryVisible: false,
        primarySummaryLabel: "Riot ID",
        secondarySummaryLabel: "",
      };
    }

    return {
      primaryLabel: "Player ID",
      primaryPlaceholder: "Masukkan Player ID",
      secondaryLabel: "",
      secondaryPlaceholder: "",
      secondaryVisible: false,
      primarySummaryLabel: "Player ID",
      secondarySummaryLabel: "",
    };
  }

  const topupConfig = getTopupConfig();
  const isGenshin = selectedGame === "genshin";

  const validReviews = useMemo(() => {
    const safeReviews = Array.isArray(reviews)
      ? reviews
      : [];

    return safeReviews
      .map((review) => {
        if (!review) return null;

        const reviewRating = Number(
          review.rating ??
            review.review_rating ??
            review.reviewRating ??
            review.stars ??
            review.order?.rating ??
            0
        );

        const reviewTextValue =
          review.review ??
          review.ulasan ??
          review.comment ??
          review.order?.review ??
          review.order?.ulasan ??
          review.order?.comment ??
          "";

        const username =
          review.username ??
          review.user?.username ??
          review.order?.username ??
          review.nickname ??
          "Customer";

        return {
          ...review,
          normalizedRating: Math.max(
            0,
            Math.min(5, reviewRating)
          ),
          normalizedText: String(
            reviewTextValue || ""
          ).trim(),
          normalizedUsername: String(
            username || "Customer"
          ),
        };
      })
      .filter(
        (review) =>
          review &&
          (review.normalizedRating > 0 ||
            review.normalizedText)
      );
  }, [reviews]);

  const averageRating = useMemo(() => {
    const ratedReviews = validReviews.filter(
      (review) => review.normalizedRating > 0
    );

    if (!ratedReviews.length) return 0;

    const total = ratedReviews.reduce(
      (sum, review) =>
        sum + review.normalizedRating,
      0
    );

    return total / ratedReviews.length;
  }, [validReviews]);

  const ratingCounts = useMemo(() => {
    const counts = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    validReviews.forEach((review) => {
      const value = Math.round(
        review.normalizedRating
      );

      if (counts[value] !== undefined) {
        counts[value]++;
      }
    });

    return counts;
  }, [validReviews]);

  const totalRatedReviews = validReviews.filter(
    (review) => review.normalizedRating > 0
  ).length;

  useEffect(() => {
    loadReviews();
  }, []);

  useEffect(() => {
    if (showOrders && user?.username) {
      loadOrders();

      const interval = setInterval(() => {
        loadOrders(true);
      }, 5000);

      return () => clearInterval(interval);
    }

    return undefined;
  }, [showOrders, user]);

  /*
   * Kalau sedang Joki lalu pindah ke game
   * yang tidak menyediakan Joki, otomatis kembali
   * ke Top Up.
   */
  useEffect(() => {
    if (service === "joki" && !isJokiAvailable) {
      setService("topup");
    }
  }, [service, isJokiAvailable]);

  useEffect(() => {
    setDiscount(0);
    setVoucherMessage("");

    if (service === "topup") {
      setTopupForm((prev) => ({
        ...prev,
        nominal: "",
        userId: "",
        serverId: "",
      }));
    }

    if (service === "joki") {
      setJokiForm((prev) => ({
        ...prev,
        currentRank: "",
        targetRank: "",
      }));
    }

    if (service === "akun") {
      setAkunForm((prev) => ({
        ...prev,
        accountId: "",
      }));
    }
  }, [selectedGame, service]);

  function showMessage(text, type) {
    setMessage(text);
    setMessageType(type || "info");

    setTimeout(() => {
      setMessage("");
    }, 5000);
  }

  function getMessageClass() {
    if (messageType === "success") {
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
    }

    if (messageType === "error") {
      return "border-red-500/20 bg-red-500/10 text-red-400";
    }

    return "border-orange-500/20 bg-orange-500/10 text-orange-400";
  }

  async function loadOrders(silent) {
    if (!user?.username) return;

    const isSilent = silent === true;

    try {
      if (!isSilent) {
        setLoading(true);
      }

      const response = await fetch(
        API_URL +
          "/api/users/" +
          encodeURIComponent(user.username) +
          "/orders?t=" +
          Date.now(),
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Gagal mengambil pesanan."
        );
      }

      const data = await response.json();

      const orderData = Array.isArray(data)
        ? data
        : Array.isArray(data?.orders)
        ? data.orders
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setOrders(orderData);
    } catch (error) {
      console.error("ORDERS ERROR:", error);

      if (!isSilent) {
        showMessage(
          "Gagal mengambil data pesanan.",
          "error"
        );
      }
    } finally {
      if (!isSilent) {
        setLoading(false);
      }
    }
  }

  async function loadReviews() {
    try {
      const response = await fetch(
        API_URL +
          "/api/reviews?t=" +
          Date.now(),
        {
          cache: "no-store",
        }
      );

      if (!response.ok) return;

      const data = await response.json();

      let reviewData = [];

      if (Array.isArray(data)) {
        reviewData = data;
      } else if (
        Array.isArray(data?.reviews)
      ) {
        reviewData = data.reviews;
      } else if (
        Array.isArray(data?.data)
      ) {
        reviewData = data.data;
      }

      setReviews(reviewData);
    } catch (error) {
      console.error("REVIEW ERROR:", error);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();

    if (
      !loginForm.username.trim() ||
      !loginForm.password.trim()
    ) {
      showMessage(
        "Username dan password wajib diisi.",
        "error"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        API_URL + "/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginForm),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Login gagal."
        );
      }

      const loggedUser =
        data?.user || data;

      setUser(loggedUser);

      localStorage.setItem(
        "barrstore_user",
        JSON.stringify(loggedUser)
      );

      setLoginForm({
        username: "",
        password: "",
      });

      setShowLogin(false);

      showMessage(
        "Login berhasil. Selamat datang kembali!",
        "success"
      );
    } catch (error) {
      console.error(error);

      showMessage(
        error?.message || "Login gagal.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();

    if (
      !registerForm.username.trim() ||
      !registerForm.password.trim()
    ) {
      showMessage(
        "Username dan password wajib diisi.",
        "error"
      );
      return;
    }

    if (registerForm.password.length < 4) {
      showMessage(
        "Password minimal 4 karakter.",
        "error"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        API_URL + "/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registerForm),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Registrasi gagal."
        );
      }

      setRegisterForm({
        username: "",
        password: "",
      });

      setShowRegister(false);
      setShowLogin(true);

      showMessage(
        "Registrasi berhasil. Silakan login.",
        "success"
      );
    } catch (error) {
      console.error(error);

      showMessage(
        error?.message || "Registrasi gagal.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("barrstore_user");

    setUser(null);
    setOrders([]);
    setShowOrders(false);

    showMessage(
      "Berhasil logout.",
      "success"
    );
  }

  async function checkVoucher(code, price) {
    const voucherCode = String(code || "");

    if (!voucherCode.trim()) {
      setDiscount(0);
      setVoucherMessage("");
      return;
    }

    if (!price || price <= 0) {
      setVoucherMessage(
        "Pilih produk terlebih dahulu."
      );
      return;
    }

    try {
      setVoucherLoading(true);
      setVoucherMessage("");

      const response = await fetch(
        API_URL + "/api/vouchers/check",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: voucherCode
              .trim()
              .toUpperCase(),
            price,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data?.success) {
        setDiscount(0);

        setVoucherMessage(
          data?.message ||
            "Voucher tidak valid."
        );

        return;
      }

      const newDiscount = Math.min(
        Number(data?.discount || 0),
        price
      );

      setDiscount(newDiscount);

      setVoucherMessage(
        "Voucher berhasil! Hemat " +
          formatRp(newDiscount)
      );
    } catch (error) {
      console.error(error);

      setDiscount(0);
      setVoucherMessage(
        "Gagal mengecek voucher."
      );
    } finally {
      setVoucherLoading(false);
    }
  }

  function requireLogin() {
    if (!user) {
      setShowLogin(true);

      showMessage(
        "Silakan login terlebih dahulu untuk melakukan pemesanan.",
        "info"
      );

      return false;
    }

    return true;
  }

  function normalizeWhatsapp(value) {
    return String(value || "")
      .replace(/\D/g, "")
      .replace(/^0/, "62");
  }

  async function submitOrder() {
    if (!requireLogin()) return;

    /*
     * Pengaman:
     * Game yang tidak masuk JOKI_GAMES
     * tidak boleh membuat order Joki.
     */
    if (service === "joki" && !isJokiAvailable) {
      showMessage(
        "Game ini tidak tersedia untuk layanan joki.",
        "error"
      );
      setService("topup");
      return;
    }

    if (!basePrice) {
      showMessage(
        "Silakan pilih produk terlebih dahulu.",
        "error"
      );
      return;
    }

    let payload = null;

    if (service === "topup") {
      if (!topupForm.nominal) {
        showMessage(
          "Pilih nominal top up.",
          "error"
        );
        return;
      }

      if (!topupForm.userId.trim()) {
        showMessage(
          topupConfig.primaryLabel +
            " wajib diisi.",
          "error"
        );
        return;
      }

      if (
        topupConfig.secondaryVisible &&
        !topupForm.serverId.trim()
      ) {
        showMessage(
          topupConfig.secondaryLabel +
            " wajib diisi.",
          "error"
        );
        return;
      }

      if (!topupForm.whatsapp.trim()) {
        showMessage(
          "Nomor WhatsApp wajib diisi.",
          "error"
        );
        return;
      }

      payload = {
        service: "topup",
        game:
          currentGame.name ||
          selectedGame,
        nominal: topupForm.nominal,
        price: basePrice,
        discount,
        finalPrice,
        voucher: topupForm.voucher
          .trim()
          .toUpperCase(),
        userId: topupForm.userId,
        serverId: topupForm.serverId,
        nickname: topupForm.nickname,
        whatsapp: normalizeWhatsapp(
          topupForm.whatsapp
        ),
        note: topupForm.note,
      };
    }

    if (service === "joki") {
      if (!currentJokiGame) {
        showMessage(
          "Game ini tidak tersedia untuk layanan joki.",
          "error"
        );
        return;
      }

      if (
        !jokiForm.currentRank ||
        !jokiForm.targetRank
      ) {
        showMessage(
          "Pilih rank awal dan rank tujuan.",
          "error"
        );
        return;
      }

      if (
        targetRankIndex <= currentRankIndex
      ) {
        showMessage(
          "Rank tujuan harus lebih tinggi dari rank sekarang.",
          "error"
        );
        return;
      }

      if (
        !jokiForm.email.trim() ||
        !jokiForm.password.trim()
      ) {
        showMessage(
          "Email dan password akun wajib diisi untuk layanan joki.",
          "error"
        );
        return;
      }

      if (!jokiForm.whatsapp.trim()) {
        showMessage(
          "Nomor WhatsApp wajib diisi.",
          "error"
        );
        return;
      }

      payload = {
        service: "joki",
        game:
          currentJokiGame.name ||
          selectedGame,
        price: basePrice,
        discount,
        finalPrice,
        voucher: jokiForm.voucher
          .trim()
          .toUpperCase(),
        nickname: "",
        whatsapp: normalizeWhatsapp(
          jokiForm.whatsapp
        ),
        note:
          (jokiForm.note || "") +
          " | Login akun: " +
          jokiForm.email,
        currentRank: jokiForm.currentRank,
        targetRank: jokiForm.targetRank,
      };
    }

    if (service === "akun") {
      if (!selectedAccount) {
        showMessage(
          "Pilih akun terlebih dahulu.",
          "error"
        );
        return;
      }

      if (!akunForm.whatsapp.trim()) {
        showMessage(
          "Nomor WhatsApp wajib diisi.",
          "error"
        );
        return;
      }

      payload = {
        service: "akun",
        game: selectedAccount.game,
        rank: selectedAccount.rank,
        level: selectedAccount.level,
        price: basePrice,
        discount,
        finalPrice,
        voucher: akunForm.voucher
          .trim()
          .toUpperCase(),
        nickname: akunForm.nickname,
        whatsapp: normalizeWhatsapp(
          akunForm.whatsapp
        ),
        note: akunForm.note,
        accountId: selectedAccount.id,
      };
    }

    if (!payload) return;

    try {
      setLoading(true);

      const response = await fetch(
        API_URL + "/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...payload,
            username: user.username,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Gagal membuat pesanan."
        );
      }

      showMessage(
        "Pesanan berhasil dibuat! Cek status di Pesanan Saya.",
        "success"
      );

      setDiscount(0);
      setVoucherMessage("");

      setTopupForm({
        nominal: "",
        userId: "",
        serverId: "",
        nickname: "",
        whatsapp: "",
        voucher: "",
        note: "",
      });

      setJokiForm({
        currentRank: "",
        targetRank: "",
        email: "",
        password: "",
        whatsapp: "",
        voucher: "",
        note: "",
      });

      setAkunForm({
        accountId: "",
        whatsapp: "",
        nickname: "",
        voucher: "",
        note: "",
      });

      await loadOrders(true);
      setShowOrders(true);
    } catch (error) {
      console.error(error);

      showMessage(
        error?.message ||
          "Gagal membuat pesanan.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  async function submitReview() {
    if (!ratingOrder) return;

    if (!user?.username) {
      showMessage(
        "Username akun tidak ditemukan. Silakan login kembali.",
        "error"
      );
      return;
    }

    try {
      setReviewLoading(true);

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
            review: reviewText.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Gagal mengirim review."
        );
      }

      setRatingOrder(null);
      setRating(5);
      setReviewText("");

      await loadOrders(true);
      await loadReviews();

      showMessage(
        "Review berhasil dikirim. Terima kasih!",
        "success"
      );
    } catch (error) {
      console.error(
        "REVIEW SUBMIT ERROR:",
        error
      );

      showMessage(
        error?.message ||
          "Gagal mengirim review.",
        "error"
      );
    } finally {
      setReviewLoading(false);
    }
  }

  const selectedVoucherCode =
    service === "topup"
      ? topupForm.voucher
      : service === "joki"
      ? jokiForm.voucher
      : akunForm.voucher;

  function setVoucherCode(value) {
    const newValue = String(
      value || ""
    ).toUpperCase();

    if (service === "topup") {
      setTopupForm((prev) => ({
        ...prev,
        voucher: newValue,
      }));
    }

    if (service === "joki") {
      setJokiForm((prev) => ({
        ...prev,
        voucher: newValue,
      }));
    }

    if (service === "akun") {
      setAkunForm((prev) => ({
        ...prev,
        voucher: newValue,
      }));
    }

    setDiscount(0);
    setVoucherMessage("");
  }

  function getServiceTitle() {
    if (service === "topup") {
      return "Top Up Game";
    }

    if (service === "joki") {
      return "Joki Rank";
    }

    return "Beli Akun";
  }

  function getServiceDescription() {
    if (service === "topup") {
      return "Pilih game dan nominal yang kamu butuhkan.";
    }

    if (service === "joki") {
      return "Naikkan rank akun dengan proses yang praktis.";
    }

    return "Pilih akun game yang tersedia.";
  }

  if (showAdmin) {
    return (
      <Admin
        API_URL={API_URL}
        onBack={() => setShowAdmin(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0d12] text-slate-100">

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0d12]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">

          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="flex items-center gap-3 text-left"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-orange-400 to-amber-300 shadow-lg shadow-orange-500/20">
              <span className="text-base font-black text-black">
                BS
              </span>
            </div>

            <div>
              <div className="text-2xl font-black tracking-tight text-white">
                Barr
                <span className="text-orange-400">
                  Store
                </span>
              </div>

              <div className="hidden text-[11px] font-medium text-slate-500 sm:block">
                Gaming marketplace
              </div>
            </div>
          </button>

          <nav className="hidden items-center gap-1 md:flex">

            <button
              onClick={() =>
                document
                  .getElementById("services")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-400 transition hover:bg-orange-500/10 hover:text-orange-400"
            >
              Layanan
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("games")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-400 transition hover:bg-orange-500/10 hover:text-orange-400"
            >
              Game
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("reviews")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-400 transition hover:bg-orange-500/10 hover:text-orange-400"
            >
              Review
            </button>

            {user && (
              <button
                onClick={() =>
                  setShowOrders(true)
                }
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-400 transition hover:bg-orange-500/10 hover:text-orange-400"
              >
                Pesanan Saya
              </button>
            )}

          </nav>

          <div className="flex items-center gap-2">

            {user ? (
              <>
                <button
                  onClick={() =>
                    setShowOrders(true)
                  }
                  className="hidden rounded-xl border border-white/10 bg-[#151820] px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-orange-400/40 hover:bg-orange-500/10 hover:text-orange-400 sm:block"
                >
                  📦 Pesanan
                </button>

                <button
                  onClick={logout}
                  className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-2 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-400 hover:to-amber-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() =>
                    setShowLogin(true)
                  }
                  className="hidden rounded-xl border border-white/10 bg-[#151820] px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-orange-400/40 hover:bg-orange-500/10 hover:text-orange-400 sm:block"
                >
                  Masuk
                </button>

                <button
                  onClick={() =>
                    setShowRegister(true)
                  }
                  className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-2 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-400 hover:to-amber-400"
                >
                  Daftar
                </button>
              </>
            )}

          </div>
        </div>
      </header>

      {message && (
        <div className="fixed left-1/2 top-20 z-[70] w-[calc(100%-32px)] max-w-lg -translate-x-1/2">
          <div
            className={
              "rounded-xl border px-4 py-3 text-sm font-bold shadow-2xl " +
              getMessageClass()
            }
          >
            {message}
          </div>
        </div>
      )}

      <main>

        <section className="relative overflow-hidden border-b border-white/10 bg-[#0b0d12]">

          <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

          <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-500/5 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-14 sm:py-20">

            <div className="max-w-3xl">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-xs font-bold text-orange-400">
                <span className="h-2 w-2 rounded-full bg-orange-400 shadow-lg shadow-orange-400/50" />
                Marketplace gaming terpercaya
              </div>

              <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">
                Semua kebutuhan game,
                <span className="block bg-gradient-to-r from-orange-400 via-orange-300 to-amber-300 bg-clip-text text-transparent">
                  satu tempat.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                Top up game, joki rank, dan akun game
                dengan proses pemesanan yang simpel
                dan jelas.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">

                <button
                  onClick={() =>
                    document
                      .getElementById("order")
                      ?.scrollIntoView({
                        behavior: "smooth",
                      })
                  }
                  className="rounded-xl bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 px-6 py-3.5 font-black text-white shadow-xl shadow-orange-500/20 transition hover:from-orange-400 hover:via-amber-400 hover:to-yellow-400"
                >
                  Mulai Pesan →
                </button>

                <button
                  onClick={() =>
                    document
                      .getElementById("games")
                      ?.scrollIntoView({
                        behavior: "smooth",
                      })
                  }
                  className="rounded-xl border border-white/10 bg-[#151820] px-6 py-3.5 font-black text-slate-300 transition hover:border-orange-400/40 hover:bg-orange-500/10 hover:text-orange-400"
                >
                  Lihat Game
                </button>

              </div>

              <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-500">
                <span>✓ Proses mudah</span>
                <span>✓ Harga transparan</span>
                <span>✓ Status pesanan jelas</span>
              </div>

            </div>
          </div>
        </section>

        <section
          id="games"
          className="mx-auto max-w-7xl px-4 py-10"
        >

          <div className="mb-5 flex items-end justify-between gap-4">

            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-400">
                Pilih game
              </p>

              <h2 className="mt-1 text-2xl font-black text-white">
                Game populer
              </h2>
            </div>

            <span className="text-sm text-slate-500">
              {safeGames.length} game tersedia
            </span>

          </div>

          {safeGames.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-[#151820] p-10 text-center">
              <div className="text-4xl">
                🎮
              </div>

              <p className="mt-3 font-bold text-slate-400">
                Data game belum tersedia.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">

              {safeGames.map((game) => {
                if (!game) return null;

                const active =
                  selectedGame === game.id;

                /*
                 * Cek apakah game ini ada
                 * di daftar JOKI_GAMES.
                 */
                const canJoki =
                  safeJokiGames.some(
                    (jokiGame) =>
                      jokiGame &&
                      jokiGame.id === game.id
                  );

                const imageSrc = game?.image
                  ? game.image
                  : "/images/games/" +
                    game.id +
                    ".jpeg";

                return (
                  <button
                    key={game.id}
                    onClick={() =>
                      setSelectedGame(game.id)
                    }
                    className={
                      "group overflow-hidden rounded-2xl border text-left shadow-lg transition " +
                      (active
                        ? "border-orange-500 bg-orange-500/10 shadow-orange-500/10"
                        : "border-white/10 bg-[#151820] hover:border-orange-400/40 hover:shadow-orange-500/5")
                    }
                  >

                    <div className="aspect-square overflow-hidden bg-[#101319]">

                      <img
                        src={imageSrc}
                        alt={game.name || "Game"}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";
                        }}
                      />

                    </div>

                    <div className="p-3">

                      <p className="line-clamp-2 text-xs font-black leading-5 text-slate-100">
                        {game.name || "Game"}
                      </p>

                      <div className="mt-2">

                        {canJoki ? (
                          <span className="inline-flex rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-emerald-400">
                            🏆 Bisa Joki
                          </span>
                        ) : (
                          <span className="inline-flex rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[9px] font-black uppercase tracking-wide text-slate-500">
                            ✕ Tidak Bisa Joki
                          </span>
                        )}

                      </div>

                      {active && (
                        <p className="mt-2 text-[10px] font-black uppercase tracking-wider text-orange-400">
                          Dipilih
                        </p>
                      )}

                    </div>

                  </button>
                );
              })}

            </div>
          )}

        </section>

        <section
          id="order"
          className="mx-auto max-w-7xl px-4 py-6 pb-16"
        >

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">

            <div className="min-w-0 rounded-3xl border border-white/10 bg-[#151820] shadow-2xl shadow-black/20">

              <div className="border-b border-white/10 p-5 sm:p-6">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-400">
                      Pemesanan
                    </p>

                    <h2 className="mt-1 text-2xl font-black text-white">
                      {getServiceTitle()}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      {getServiceDescription()}
                    </p>

                  </div>

                  <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-left sm:text-right">

                    <p className="text-xs text-slate-500">
                      Game
                    </p>

                    <p className="font-black text-orange-400">
                      {currentGame.name ||
                        selectedGame}
                    </p>

                  </div>

                </div>

                <div
                  id="services"
                  className="mt-6 grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-[#0f1218] p-1.5"
                >

                  <button
                    onClick={() =>
                      setService("topup")
                    }
                    className={
                      "rounded-xl px-3 py-3 text-sm font-black transition " +
                      (service === "topup"
                        ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-500/20"
                        : "text-slate-400 hover:bg-white/5 hover:text-orange-400")
                    }
                  >
                    <span className="mr-1">
                      💎
                    </span>
                    Top Up
                  </button>

                  <button
                    onClick={() => {
                      if (!isJokiAvailable) {
                        showMessage(
                          "Game ini tidak tersedia untuk layanan joki.",
                          "error"
                        );
                        return;
                      }

                      setService("joki");
                    }}
                    disabled={!isJokiAvailable}
                    className={
                      "rounded-xl px-3 py-3 text-sm font-black transition " +
                      (service === "joki"
                        ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-500/20"
                        : isJokiAvailable
                        ? "text-slate-400 hover:bg-white/5 hover:text-orange-400"
                        : "cursor-not-allowed text-slate-700 opacity-60")
                    }
                  >
                    <span className="mr-1">
                      🏆
                    </span>
                    {isJokiAvailable
                      ? "Joki"
                      : "Joki Tidak Tersedia"}
                  </button>

                  <button
                    onClick={() =>
                      setService("akun")
                    }
                    className={
                      "rounded-xl px-3 py-3 text-sm font-black transition " +
                      (service === "akun"
                        ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-500/20"
                        : "text-slate-400 hover:bg-white/5 hover:text-orange-400")
                    }
                  >
                    <span className="mr-1">
                      🎮
                    </span>
                    Akun
                  </button>

                </div>

                {!isJokiAvailable && (
                  <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-bold text-slate-500">
                    ℹ️ Game ini hanya tersedia untuk Top Up dan Beli Akun. Layanan Joki tidak tersedia.
                  </div>
                )}

              </div>

              <div className="p-5 sm:p-6">

                {service === "topup" && (
                  <div className="space-y-6">

                    <div>

                      <label className="mb-3 block text-sm font-black text-slate-200">
                        Pilih Nominal
                      </label>

                      {currentNominals.length ===
                      0 ? (
                        <div className="rounded-2xl border border-dashed border-white/10 bg-[#101319] p-6 text-center text-sm text-slate-500">
                          Nominal untuk game ini
                          belum tersedia.
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

                          {currentNominals.map(
                            (nominal) => {
                              if (!nominal) {
                                return null;
                              }

                              const active =
                                topupForm.nominal ===
                                nominal.label;

                              return (
                                <button
                                  key={
                                    nominal.label
                                  }
                                  onClick={() =>
                                    setTopupForm(
                                      (prev) => ({
                                        ...prev,
                                        nominal:
                                          nominal.label,
                                      })
                                    )
                                  }
                                  className={
                                    "rounded-xl border p-4 text-left transition " +
                                    (active
                                      ? "border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/10"
                                      : "border-white/10 bg-[#101319] hover:border-orange-400/40 hover:bg-orange-500/5")
                                  }
                                >

                                  <p className="text-sm font-black text-slate-100">
                                    {nominal.label}
                                  </p>

                                  <p className="mt-2 text-sm font-bold text-orange-400">
                                    {formatRp(
                                      nominal.price
                                    )}
                                  </p>

                                </button>
                              );
                            }
                          )}

                        </div>
                      )}

                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">

                      <Input
                        label={
                          topupConfig.primaryLabel
                        }
                        value={
                          topupForm.userId
                        }
                        onChange={(value) =>
                          setTopupForm(
                            (prev) => ({
                              ...prev,
                              userId: value,
                            })
                          )
                        }
                        placeholder={
                          topupConfig.primaryPlaceholder
                        }
                      />

                      {topupConfig.secondaryVisible &&
                        (isGenshin ? (
                          <SelectInput
                            label="Server Region"
                            value={
                              topupForm.serverId
                            }
                            onChange={(value) =>
                              setTopupForm(
                                (prev) => ({
                                  ...prev,
                                  serverId:
                                    value,
                                })
                              )
                            }
                            options={[
                              "Asia",
                              "America",
                              "Europe",
                              "TW, HK, MO",
                            ]}
                          />
                        ) : (
                          <Input
                            label={
                              topupConfig.secondaryLabel
                            }
                            value={
                              topupForm.serverId
                            }
                            onChange={(value) =>
                              setTopupForm(
                                (prev) => ({
                                  ...prev,
                                  serverId:
                                    value,
                                })
                              )
                            }
                            placeholder={
                              topupConfig.secondaryPlaceholder
                            }
                          />
                        ))}

                      <Input
                        label="Nickname"
                        value={
                          topupForm.nickname
                        }
                        onChange={(value) =>
                          setTopupForm(
                            (prev) => ({
                              ...prev,
                              nickname: value,
                            })
                          )
                        }
                        placeholder="Nama dalam game"
                      />

                      <Input
                        label="WhatsApp"
                        value={
                          topupForm.whatsapp
                        }
                        onChange={(value) =>
                          setTopupForm(
                            (prev) => ({
                              ...prev,
                              whatsapp: value,
                            })
                          )
                        }
                        placeholder="08xxxxxxxxxx"
                      />

                    </div>

                    <Textarea
                      label="Catatan"
                      value={topupForm.note}
                      onChange={(value) =>
                        setTopupForm(
                          (prev) => ({
                            ...prev,
                            note: value,
                          })
                        )
                      }
                      placeholder="Catatan tambahan jika ada..."
                    />

                  </div>
                )}

                {service === "joki" &&
                  isJokiAvailable && (
                  <div className="space-y-6">

                    {currentRanks.length ===
                    0 ? (
                      <div className="rounded-2xl border border-dashed border-white/10 bg-[#101319] p-6 text-center text-sm text-slate-500">
                        Data rank untuk game ini
                        belum tersedia.
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2">

                        <SelectInput
                          label="Rank Sekarang"
                          value={
                            jokiForm.currentRank
                          }
                          onChange={(value) =>
                            setJokiForm(
                              (prev) => ({
                                ...prev,
                                currentRank:
                                  value,
                                targetRank:
                                  "",
                              })
                            )
                          }
                          options={
                            currentRanks
                          }
                        />

                        <SelectInput
                          label="Target Rank"
                          value={
                            jokiForm.targetRank
                          }
                          onChange={(value) =>
                            setJokiForm(
                              (prev) => ({
                                ...prev,
                                targetRank:
                                  value,
                              })
                            )
                          }
                          options={currentRanks.filter(
                            (_, index) =>
                              currentRankIndex < 0 ||
                              index >
                                currentRankIndex
                          )}
                        />

                      </div>
                    )}

                    {jokiTierDifference > 0 && (
                      <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 p-4">

                        <div className="flex items-center justify-between gap-4">

                          <div>

                            <p className="text-xs font-bold text-slate-500">
                              Estimasi biaya
                            </p>

                            <p className="mt-1 text-lg font-black text-orange-400">
                              {jokiTierDifference}{" "}
                              tier ×{" "}
                              {formatRp(
                                Number(
                                  JOKI_PRICE_PER_TIER?.[
                                    selectedGame
                                  ] || 0
                                )
                              )}
                            </p>

                          </div>

                          <p className="text-xl font-black text-white">
                            {formatRp(
                              jokiPrice
                            )}
                          </p>

                        </div>

                      </div>
                    )}

                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">

                      <p className="text-sm font-black text-amber-400">
                        🔐 Data login akun
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        Data login digunakan
                        untuk proses joki.
                      </p>

                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">

                      <Input
                        label="Email / Username Akun"
                        value={
                          jokiForm.email
                        }
                        onChange={(value) =>
                          setJokiForm(
                            (prev) => ({
                              ...prev,
                              email: value,
                            })
                          )
                        }
                        placeholder="Email akun game"
                      />

                      <Input
                        label="Password Akun"
                        type="password"
                        value={
                          jokiForm.password
                        }
                        onChange={(value) =>
                          setJokiForm(
                            (prev) => ({
                              ...prev,
                              password:
                                value,
                            })
                          )
                        }
                        placeholder="Password akun"
                      />

                      <Input
                        label="WhatsApp"
                        value={
                          jokiForm.whatsapp
                        }
                        onChange={(value) =>
                          setJokiForm(
                            (prev) => ({
                              ...prev,
                              whatsapp:
                                value,
                            })
                          )
                        }
                        placeholder="08xxxxxxxxxx"
                      />

                    </div>

                    <Textarea
                      label="Catatan"
                      value={jokiForm.note}
                      onChange={(value) =>
                        setJokiForm(
                          (prev) => ({
                            ...prev,
                            note: value,
                          })
                        )
                      }
                      placeholder="Catatan tambahan..."
                    />

                  </div>
                )}

                {service === "akun" && (
                  <div className="space-y-6">

                    <div>

                      <label className="mb-3 block text-sm font-black text-slate-200">
                        Pilih Akun
                      </label>

                      {safeAccounts.length ===
                      0 ? (
                        <div className="rounded-2xl border border-dashed border-white/10 bg-[#101319] p-6 text-center text-sm text-slate-500">
                          Belum ada akun yang
                          tersedia.
                        </div>
                      ) : (
                        <div className="space-y-3">

                          {safeAccounts.map(
                            (account) => {
                              if (!account) {
                                return null;
                              }

                              const active =
                                String(
                                  akunForm.accountId
                                ) ===
                                String(
                                  account.id
                                );

                              return (
                                <button
                                  key={
                                    account.id
                                  }
                                  onClick={() =>
                                    setAkunForm(
                                      (prev) => ({
                                        ...prev,
                                        accountId:
                                          account.id,
                                      })
                                    )
                                  }
                                  className={
                                    "w-full rounded-2xl border p-4 text-left transition " +
                                    (active
                                      ? "border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/10"
                                      : "border-white/10 bg-[#101319] hover:border-orange-400/40 hover:bg-orange-500/5")
                                  }
                                >

                                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                    <div className="min-w-0">

                                      <div className="flex flex-wrap items-center gap-2">

                                        <span className="rounded-lg bg-orange-500/10 px-2 py-1 text-xs font-black text-orange-400">
                                          {account.game}
                                        </span>

                                        <span className="text-sm font-black text-slate-100">
                                          {account.rank}
                                        </span>

                                        <span className="text-xs text-slate-500">
                                          Lv.{" "}
                                          {account.level}
                                        </span>

                                      </div>

                                      <p className="mt-2 text-sm text-slate-400">
                                        {account.note}
                                      </p>

                                    </div>

                                    <p className="shrink-0 text-lg font-black text-orange-400">
                                      {formatRp(
                                        account.price
                                      )}
                                    </p>

                                  </div>

                                </button>
                              );
                            }
                          )}

                        </div>
                      )}

                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">

                      <Input
                        label="Nickname Tujuan"
                        value={
                          akunForm.nickname
                        }
                        onChange={(value) =>
                          setAkunForm(
                            (prev) => ({
                              ...prev,
                              nickname:
                                value,
                            })
                          )
                        }
                        placeholder="Nama penerima"
                      />

                      <Input
                        label="WhatsApp"
                        value={
                          akunForm.whatsapp
                        }
                        onChange={(value) =>
                          setAkunForm(
                            (prev) => ({
                              ...prev,
                              whatsapp:
                                value,
                            })
                          )
                        }
                        placeholder="08xxxxxxxxxx"
                      />

                    </div>

                    <Textarea
                      label="Catatan"
                      value={akunForm.note}
                      onChange={(value) =>
                        setAkunForm(
                          (prev) => ({
                            ...prev,
                            note: value,
                          })
                        )
                      }
                      placeholder="Catatan tambahan..."
                    />

                  </div>
                )}

                <div className="mt-7 border-t border-white/10 pt-6">

                  <label className="mb-2 block text-sm font-black text-slate-200">
                    Kode Voucher
                  </label>

                  <div className="flex flex-col gap-2 sm:flex-row">

                    <input
                      value={
                        selectedVoucherCode
                      }
                      onChange={(e) =>
                        setVoucherCode(
                          e.target.value
                        )
                      }
                      placeholder="Contoh: BARR10"
                      className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#0f1218] px-4 py-3 text-sm font-bold uppercase text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-orange-400 focus:bg-[#12151c]"
                    />

                    <button
                      onClick={() =>
                        checkVoucher(
                          selectedVoucherCode,
                          basePrice
                        )
                      }
                      disabled={
                        voucherLoading
                      }
                      className="rounded-xl border border-orange-500/20 bg-orange-500/10 px-5 py-3 text-sm font-black text-orange-400 transition hover:bg-orange-500/20 disabled:opacity-50"
                    >
                      {voucherLoading
                        ? "Mengecek..."
                        : "Pakai Voucher"}
                    </button>

                  </div>

                  {voucherMessage && (
                    <p className="mt-2 text-xs font-bold text-orange-400">
                      {voucherMessage}
                    </p>
                  )}

                </div>

                <button
                  onClick={submitOrder}
                  disabled={
                    loading || !basePrice
                  }
                  className="mt-7 w-full rounded-xl bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 px-5 py-4 font-black text-white shadow-xl shadow-orange-500/20 transition hover:from-orange-400 hover:via-amber-400 hover:to-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading
                    ? "⏳ Memproses..."
                    : user
                    ? "🛒 Buat Pesanan"
                    : "🔐 Login untuk Memesan"}
                </button>

              </div>
            </div>

            <aside className="h-fit min-w-0 rounded-3xl border border-white/10 bg-[#151820] shadow-2xl shadow-black/20">

              <div className="border-b border-white/10 p-5">

                <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-400">
                  Checkout
                </p>

                <h2 className="mt-1 text-xl font-black text-white">
                  Ringkasan Pesanan
                </h2>

              </div>

              <div className="p-5">

                <div className="rounded-2xl border border-white/10 bg-[#0f1218] p-4">

                  <p className="text-xs font-bold text-slate-500">
                    Layanan
                  </p>

                  <p className="mt-1 font-black text-white">
                    {getServiceTitle()}
                  </p>

                  <p className="mt-1 text-sm text-orange-400">
                    {currentGame.name ||
                      selectedGame}
                  </p>

                </div>

                <div className="mt-4 space-y-3 text-sm">

                  {service === "topup" && (
                    <>
                      <SummaryRow
                        label="Nominal"
                        value={
                          topupForm.nominal ||
                          "-"
                        }
                      />

                      <SummaryRow
                        label={
                          topupConfig.primarySummaryLabel
                        }
                        value={
                          topupForm.userId ||
                          "-"
                        }
                      />

                      {topupConfig.secondaryVisible &&
                        topupForm.serverId && (
                          <SummaryRow
                            label={
                              topupConfig.secondarySummaryLabel
                            }
                            value={
                              topupForm.serverId
                            }
                          />
                        )}
                    </>
                  )}

                  {service === "joki" && (
                    <>
                      <SummaryRow
                        label="Rank awal"
                        value={
                          jokiForm.currentRank ||
                          "-"
                        }
                      />

                      <SummaryRow
                        label="Target"
                        value={
                          jokiForm.targetRank ||
                          "-"
                        }
                      />

                      <SummaryRow
                        label="Tier"
                        value={
                          jokiTierDifference
                            ? jokiTierDifference +
                              " tier"
                            : "-"
                        }
                      />
                    </>
                  )}

                  {service === "akun" && (
                    <>
                      <SummaryRow
                        label="Akun"
                        value={
                          selectedAccount
                            ? selectedAccount.game
                            : "-"
                        }
                      />

                      <SummaryRow
                        label="Rank"
                        value={
                          selectedAccount
                            ? selectedAccount.rank
                            : "-"
                        }
                      />

                      <SummaryRow
                        label="Level"
                        value={
                          selectedAccount
                            ? String(
                                selectedAccount.level
                              )
                            : "-"
                        }
                      />
                    </>
                  )}

                  <div className="my-4 border-t border-white/10" />

                  <SummaryRow
                    label="Harga"
                    value={formatRp(basePrice)}
                  />

                  {discount > 0 && (
                    <SummaryRow
                      label="Diskon"
                      value={
                        "- " +
                        formatRp(discount)
                      }
                      valueClass="text-emerald-400"
                    />
                  )}

                </div>

                <div className="mt-5 rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-amber-500/5 p-4">

                  <div className="flex items-end justify-between gap-4">

                    <div>

                      <p className="text-xs font-bold text-slate-500">
                        Total pembayaran
                      </p>

                      <p className="mt-1 text-2xl font-black text-orange-400">
                        {formatRp(
                          finalPrice
                        )}
                      </p>

                    </div>

                    <span className="rounded-lg bg-orange-500/15 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-orange-400">
                      Total
                    </span>

                  </div>

                </div>

                {!user && (
                  <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                    Kamu harus login sebelum
                    membuat pesanan.
                  </p>
                )}

              </div>
            </aside>

          </div>
        </section>

        <section className="border-y border-white/10 bg-[#101319]">

          <div className="mx-auto max-w-7xl px-4 py-12">

            <div className="grid gap-4 md:grid-cols-3">

              <Feature
                icon="⚡"
                title="Proses Praktis"
                text="Pilih layanan, isi data, lalu buat pesanan."
              />

              <Feature
                icon="🔒"
                title="Data Pesanan Terstruktur"
                text="Informasi order tersimpan agar mudah dipantau."
              />

              <Feature
                icon="📦"
                title="Pantau Pesanan"
                text="Status pesanan dapat dilihat dari menu Pesanan Saya."
              />

            </div>

          </div>

        </section>

        <section
          id="reviews"
          className="border-b border-white/10 bg-[#0b0d12]"
        >

          <div className="mx-auto max-w-7xl px-4 py-14 sm:py-16">

            <div className="mb-8">

              <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-400">
                Customer feedback
              </p>

              <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">
                Apa kata pelanggan?
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Lihat pengalaman customer yang
                sudah menggunakan layanan BarrStore.
              </p>

            </div>

            {validReviews.length === 0 ? (

              <div className="rounded-3xl border border-dashed border-white/10 bg-[#151820] p-10 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-2xl">
                  ⭐
                </div>

                <h3 className="mt-4 font-black text-slate-100">
                  Belum ada ulasan
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Jadilah customer pertama yang
                  memberikan rating untuk BarrStore.
                </p>

              </div>

            ) : (

              <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">

                <div className="h-fit rounded-3xl border border-white/10 bg-[#151820] p-6 shadow-lg">

                  <p className="text-sm font-bold text-slate-500">
                    Rating BarrStore
                  </p>

                  <div className="mt-3 flex items-end gap-3">

                    <span className="text-5xl font-black tracking-tight text-white">
                      {averageRating.toFixed(
                        1
                      )}
                    </span>

                    <div className="pb-1">

                      <div className="text-lg tracking-widest text-amber-400">
                        {renderStars(
                          Math.round(
                            averageRating
                          )
                        )}
                      </div>

                      <p className="mt-1 text-xs text-slate-500">
                        {totalRatedReviews}{" "}
                        ulasan
                      </p>

                    </div>
                  </div>

                  <div className="mt-7 space-y-2.5">

                    {[5, 4, 3, 2, 1].map(
                      (star) => {
                        const count =
                          ratingCounts[
                            star
                          ] || 0;

                        const percentage =
                          totalRatedReviews >
                          0
                            ? (count /
                                totalRatedReviews) *
                              100
                            : 0;

                        return (
                          <div
                            key={star}
                            className="flex items-center gap-2"
                          >

                            <span className="w-8 text-xs font-bold text-slate-400">
                              {star}★
                            </span>

                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">

                              <div
                                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
                                style={{
                                  width:
                                    percentage +
                                    "%",
                                }}
                              />

                            </div>

                            <span className="w-6 text-right text-xs font-bold text-slate-500">
                              {count}
                            </span>

                          </div>
                        );
                      }
                    )}

                  </div>

                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  {validReviews
                    .slice(0, 6)
                    .map(
                      (
                        review,
                        index
                      ) => (
                        <PublicReviewCard
                          key={
                            review.id ||
                            review.orderId ||
                            index
                          }
                          review={review}
                        />
                      )
                    )}

                </div>

              </div>
            )}

            {validReviews.length > 6 && (
              <p className="mt-6 text-center text-xs font-bold text-slate-500">
                Menampilkan 6 ulasan terbaru
              </p>
            )}

          </div>
        </section>

      </main>

      <footer className="border-t border-white/10 bg-[#080a0f]">

        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-300">
              <span className="text-sm font-black text-black">
                BS
              </span>
            </div>

            <div>
              <div className="text-xl font-black text-white">
                Barr
                <span className="text-orange-400">
                  Store
                </span>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Gaming marketplace.
              </p>
            </div>

          </div>

          <div className="flex flex-wrap gap-2">

            <button
              onClick={() =>
                setShowAdmin(true)
              }
              className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-500 transition hover:border-orange-400/40 hover:bg-orange-500/10 hover:text-orange-400"
            >
              Admin
            </button>

            {user && (
              <button
                onClick={() =>
                  setShowOrders(true)
                }
                className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-500 transition hover:border-orange-400/40 hover:bg-orange-500/10 hover:text-orange-400"
              >
                Pesanan Saya
              </button>
            )}

          </div>

        </div>

      </footer>

      {showLogin && (
        <Modal
          onClose={() =>
            setShowLogin(false)
          }
        >

          <div className="text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-3xl">
              🔐
            </div>

            <h2 className="mt-4 text-2xl font-black text-white">
              Masuk ke BarrStore
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Login untuk melihat dan membuat
              pesanan.
            </p>

          </div>

          <form
            onSubmit={handleLogin}
            className="mt-6 space-y-4"
          >

            <Input
              label="Username"
              value={
                loginForm.username
              }
              onChange={(value) =>
                setLoginForm(
                  (prev) => ({
                    ...prev,
                    username: value,
                  })
                )
              }
              placeholder="Username"
            />

            <Input
              label="Password"
              type="password"
              value={
                loginForm.password
              }
              onChange={(value) =>
                setLoginForm(
                  (prev) => ({
                    ...prev,
                    password: value,
                  })
                )
              }
              placeholder="Password"
            />

            <button
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-5 py-3.5 font-black text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-400 hover:to-amber-400 disabled:opacity-50"
            >
              {loading
                ? "Memproses..."
                : "Login"}
            </button>

          </form>

          <button
            onClick={() => {
              setShowLogin(false);
              setShowRegister(true);
            }}
            className="mt-4 w-full text-center text-sm font-bold text-orange-400"
          >
            Belum punya akun? Daftar
          </button>

        </Modal>
      )}

      {showRegister && (
        <Modal
          onClose={() =>
            setShowRegister(false)
          }
        >

          <div className="text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-3xl">
              👤
            </div>

            <h2 className="mt-4 text-2xl font-black text-white">
              Buat Akun
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Daftar untuk mulai menggunakan
              BarrStore.
            </p>

          </div>

          <form
            onSubmit={handleRegister}
            className="mt-6 space-y-4"
          >

            <Input
              label="Username"
              value={
                registerForm.username
              }
              onChange={(value) =>
                setRegisterForm(
                  (prev) => ({
                    ...prev,
                    username: value,
                  })
                )
              }
              placeholder="Username"
            />

            <Input
              label="Password"
              type="password"
              value={
                registerForm.password
              }
              onChange={(value) =>
                setRegisterForm(
                  (prev) => ({
                    ...prev,
                    password: value,
                  })
                )
              }
              placeholder="Minimal 4 karakter"
            />

            <button
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-5 py-3.5 font-black text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-400 hover:to-amber-400 disabled:opacity-50"
            >
              {loading
                ? "Memproses..."
                : "Daftar"}
            </button>

          </form>

          <button
            onClick={() => {
              setShowRegister(false);
              setShowLogin(true);
            }}
            className="mt-4 w-full text-center text-sm font-bold text-orange-400"
          >
            Sudah punya akun? Login
          </button>

        </Modal>
      )}

      {showOrders && (
        <Modal
          wide
          onClose={() =>
            setShowOrders(false)
          }
        >

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-400">
                Account
              </p>

              <h2 className="mt-1 text-2xl font-black text-white">
                Pesanan Saya
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {user?.username ||
                  "Customer"}
              </p>

            </div>

            <button
              onClick={() =>
                loadOrders(false)
              }
              disabled={loading}
              className="rounded-xl border border-white/10 bg-[#101319] px-4 py-2 text-sm font-bold text-slate-300 transition hover:border-orange-400/40 hover:bg-orange-500/10 hover:text-orange-400"
            >
              🔄 Refresh
            </button>

          </div>

          <div className="mt-6 space-y-3">

            {orders.length === 0 ? (

              <div className="rounded-2xl border border-dashed border-white/10 bg-[#101319] p-10 text-center">

                <div className="text-4xl">
                  📭
                </div>

                <p className="mt-3 font-bold text-slate-500">
                  Belum ada pesanan.
                </p>

                <button
                  onClick={() =>
                    loadOrders(false)
                  }
                  className="mt-4 rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs font-black text-orange-400 transition hover:bg-orange-500/20"
                >
                  🔄 Coba Refresh
                </button>

              </div>

            ) : (

              orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onReview={() => {
                    setRatingOrder(order);

                    setRating(
                      Number(
                        order.rating ||
                          5
                      )
                    );

                    setReviewText(
                      order.review ||
                        order.ulasan ||
                        order.comment ||
                        ""
                    );
                  }}
                />
              ))

            )}

          </div>

        </Modal>
      )}

      {ratingOrder && (
        <Modal
          onClose={() =>
            setRatingOrder(null)
          }
        >

          <div className="text-center">

            <div className="text-4xl">
              ⭐
            </div>

            <h2 className="mt-3 text-2xl font-black text-white">
              Beri Rating
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Pesanan #{ratingOrder.id}
            </p>

            <p className="mt-2 text-xs font-bold text-orange-400">
              Review sebagai:{" "}
              {user?.username ||
                "Customer"}
            </p>

          </div>

          <div className="mt-6 flex justify-center gap-2">

            {[1, 2, 3, 4, 5].map(
              (star) => (
                <button
                  key={star}
                  onClick={() =>
                    setRating(star)
                  }
                  className={
                    "text-4xl transition " +
                    (star <= rating
                      ? "text-amber-400"
                      : "text-slate-700")
                  }
                >
                  ★
                </button>
              )
            )}

          </div>

          <textarea
            value={reviewText}
            onChange={(e) =>
              setReviewText(
                e.target.value
              )
            }
            placeholder="Tulis pengalaman kamu..."
            rows={5}
            className="mt-6 w-full resize-none rounded-xl border border-white/10 bg-[#0f1218] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-orange-400 focus:bg-[#12151c]"
          />

          <button
            onClick={submitReview}
            disabled={reviewLoading}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-5 py-3.5 font-black text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-400 hover:to-amber-400 disabled:opacity-50"
          >
            {reviewLoading
              ? "Mengirim..."
              : "Kirim Review"}
          </button>

        </Modal>
      )}

    </div>
  );
}

function PublicReviewCard({ review }) {
  const username =
    review?.normalizedUsername ||
    "Customer";

  const maskedUsername =
    username.length > 4
      ? username.slice(0, 3) + "***"
      : username.charAt(0) + "***";

  return (
    <div className="rounded-3xl border border-white/10 bg-[#151820] p-5 shadow-lg transition hover:border-orange-400/30 hover:shadow-xl">

      <div className="flex items-start justify-between gap-3">

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-sm font-black text-orange-400">
            {username
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="min-w-0">

            <p className="truncate text-sm font-black text-slate-100">
              {maskedUsername}
            </p>

            <p className="mt-0.5 text-[11px] text-slate-500">
              Customer BarrStore
            </p>

          </div>

        </div>

        <div className="shrink-0 text-sm tracking-widest text-amber-400">
          {renderStars(
            review?.normalizedRating || 0
          )}
        </div>

      </div>

      {review?.normalizedText ? (
        <p className="mt-5 text-sm leading-6 text-slate-400">
          "{review.normalizedText}"
        </p>
      ) : (
        <p className="mt-5 text-sm italic text-slate-500">
          Customer memberikan rating tanpa
          komentar.
        </p>
      )}

    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-black text-slate-200">
        {label}
      </label>

      <input
        type={type || "text"}
        value={value || ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-[#0f1218] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-orange-400 focus:bg-[#12151c] focus:ring-2 focus:ring-orange-500/10"
      />

    </div>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
}) {
  const safeOptions = Array.isArray(
    options
  )
    ? options
    : [];

  return (
    <div>

      <label className="mb-2 block text-sm font-black text-slate-200">
        {label}
      </label>

      <select
        value={value || ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-xl border border-white/10 bg-[#0f1218] px-4 py-3 text-sm font-bold text-slate-100 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10"
      >

        <option
          value=""
          className="bg-[#151820]"
        >
          Pilih {label}
        </option>

        {safeOptions.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-[#151820]"
          >
            {option}
          </option>
        ))}

      </select>

    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-black text-slate-200">
        {label}
      </label>

      <textarea
        value={value || ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        rows={4}
        className="w-full resize-none rounded-xl border border-white/10 bg-[#0f1218] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-orange-400 focus:bg-[#12151c] focus:ring-2 focus:ring-orange-500/10"
      />

    </div>
  );
}

function SummaryRow({
  label,
  value,
  valueClass,
}) {
  return (
    <div className="flex items-start justify-between gap-4">

      <span className="text-slate-500">
        {label}
      </span>

      <span
        className={
          "max-w-[65%] break-words text-right font-bold " +
          (valueClass || "text-slate-300")
        }
      >
        {value}
      </span>

    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#151820] p-5 shadow-lg shadow-black/10">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-xl">
        {icon}
      </div>

      <h3 className="mt-4 font-black text-slate-100">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-6 text-slate-500">
        {text}
      </p>

    </div>
  );
}

function Modal({
  children,
  onClose,
  wide,
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-md sm:items-center">

      <div
        className={
          "my-4 w-full rounded-3xl border border-white/10 bg-[#151820] shadow-2xl shadow-black/50 " +
          (wide
            ? "max-w-3xl"
            : "max-w-md")
        }
      >

        <div className="flex justify-end px-4 pt-4">

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-500 transition hover:bg-orange-500/10 hover:text-orange-400"
          >
            ×
          </button>

        </div>

        <div className="max-h-[calc(100vh-70px)] overflow-y-auto px-5 pb-6 sm:px-7">
          {children}
        </div>

      </div>

    </div>
  );
}

function OrderCard({
  order,
  onReview,
}) {
  const safeOrder = order || {};

  const statusClass =
    safeOrder.status === "pending"
      ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
      : safeOrder.status === "diproses"
      ? "border-blue-500/20 bg-blue-500/10 text-blue-400"
      : safeOrder.status === "selesai"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
      : safeOrder.status === "dibatalkan"
      ? "border-red-500/20 bg-red-500/10 text-red-400"
      : "border-white/10 bg-white/5 text-slate-400";

  const canReview =
    safeOrder.status === "selesai" &&
    !safeOrder.rating &&
    !safeOrder.review &&
    !safeOrder.ulasan;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#101319] p-5 shadow-lg">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div className="min-w-0">

          <div className="flex flex-wrap items-center gap-2">

            <span className="font-black text-white">
              #{safeOrder.id}
            </span>

            <span className="rounded-lg bg-orange-500/10 px-2 py-1 text-xs font-black text-orange-400">
              {safeOrder.service ||
                "Order"}
            </span>

            <span
              className={
                "rounded-lg border px-2 py-1 text-xs font-black " +
                statusClass
              }
            >
              {safeOrder.status ||
                "unknown"}
            </span>

          </div>

          <p className="mt-3 font-black text-slate-100">
            {safeOrder.game ||
              "Layanan BarrStore"}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {safeOrder.nominal ||
              safeOrder.rank ||
              safeOrder.note ||
              "-"}
          </p>

        </div>

        <p className="shrink-0 text-lg font-black text-orange-400">
          {formatRp(
            safeOrder.finalPrice ??
              safeOrder.price ??
              0
          )}
        </p>

      </div>

      {canReview && (
        <button
          onClick={onReview}
          className="mt-4 rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs font-black text-orange-400 transition hover:bg-orange-500/20"
        >
          ⭐ Beri Rating
        </button>
      )}

      {(safeOrder.rating ||
        safeOrder.review ||
        safeOrder.ulasan ||
        safeOrder.comment) && (

        <div className="mt-4 rounded-xl border border-white/10 bg-[#151820] p-4">

          <p className="text-sm tracking-widest text-amber-400">
            {renderStars(
              Number(
                safeOrder.rating ||
                  safeOrder.review_rating ||
                  safeOrder.reviewRating ||
                  safeOrder.stars ||
                  0
              )
            )}
          </p>

          {(safeOrder.review ||
            safeOrder.ulasan ||
            safeOrder.comment) && (
            <p className="mt-2 text-sm text-slate-400">
              "
              {safeOrder.review ||
                safeOrder.ulasan ||
                safeOrder.comment}
              "
            </p>
          )}

        </div>
      )}

    </div>
  );
}

function renderStars(rating) {
  const rounded = Math.round(
    Number(rating || 0)
  );

  return [1, 2, 3, 4, 5]
    .map((star) =>
      star <= rounded
        ? "★"
        : "☆"
    )
    .join("");
}

export default App;