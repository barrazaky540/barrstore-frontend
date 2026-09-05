import { useState, useEffect } from "react";
import {
  GAMES,
  NOMINALS,
  JOKI_GAMES,
  JOKI_PRICE_PER_TIER,
  AKUN_LIST,
  formatRp
} from "./data";
import Admin from "./Admin";

const API_URL = "https://barrstore-backend-bhjj.vercel.app";

async function sendOrder(orderData) {
  const response = await fetch(`${API_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  const text = await response.text();

  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {
      message: text || "Server tidak memberikan response.",
    };
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        `Gagal membuat pesanan. Status ${response.status}`
    );
  }

  return data;
}

function App() {
  const [service, setService] = useState("topup");
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedNominal, setSelectedNominal] = useState("");
  const [selectedJokiGame, setSelectedJokiGame] = useState("");
  const [selectedRank, setSelectedRank] = useState("");
  const [selectedAkun, setSelectedAkun] = useState(null);

  const [nickname, setNickname] = useState("");
  const [userId, setUserId] = useState("");
  const [serverId, setServerId] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [note, setNote] = useState("");

  const [username, setUsername] = useState(
    localStorage.getItem("barrstore_username") || ""
  );

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem("barrstore_username");

    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const currentJokiGame = JOKI_GAMES.find(
    (game) => game.id === selectedJokiGame
  );

  const jokiPrice =
    selectedJokiGame && selectedRank
      ? JOKI_PRICE_PER_TIER[selectedJokiGame] || 0
      : 0;

  const selectedNominalData = NOMINALS[selectedGame]?.find(
    (item) => item.label === selectedNominal
  );

  async function handleTopup() {
    if (!selectedGame || !selectedNominal) {
      setMessage("Pilih game dan nominal terlebih dahulu.");
      return;
    }

    if (!nickname || !userId) {
      setMessage("Nickname dan User ID wajib diisi.");
      return;
    }

    const price = selectedNominalData?.price || 0;

    setLoading(true);
    setMessage("");

    try {
      const result = await sendOrder({
        username,
        service: "topup",
        game: selectedGame,
        nominal: selectedNominal,
        price,
        status: "pending",
        nickname,
        userId,
        serverId,
        whatsapp,
        note,
      });

      setMessage(
        `Pesanan berhasil! ID Pesanan: #${result.orderId} — Status: pending`
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleJoki() {
    if (!selectedJokiGame || !selectedRank) {
      setMessage("Pilih game dan rank terlebih dahulu.");
      return;
    }

    if (!whatsapp) {
      setMessage("Nomor WhatsApp wajib diisi.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await sendOrder({
        username,
        service: "joki",
        game: selectedJokiGame,
        nominal: selectedRank,
        price: jokiPrice,
        status: "pending",
        nickname,
        userId,
        serverId,
        whatsapp,
        note,
      });

      setMessage(
        `Pesanan joki berhasil! ID Pesanan: #${result.orderId} — Status: pending`
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAkun() {
    if (!selectedAkun) {
      setMessage("Pilih akun terlebih dahulu.");
      return;
    }

    if (!whatsapp) {
      setMessage("Nomor WhatsApp wajib diisi.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await sendOrder({
        username,
        service: "akun",
        game: selectedAkun.game,
        nominal: `Rank ${selectedAkun.rank} - Level ${selectedAkun.level}`,
        price: selectedAkun.price,
        status: "pending",
        nickname,
        userId,
        serverId,
        whatsapp,
        note: selectedAkun.note,
      });

      setMessage(
        `Pesanan akun berhasil! ID Pesanan: #${result.orderId} — Status: pending`
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen bg-slate-900 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Barr<span className="text-cyan-400">Store</span>
            </h1>
            <p className="text-xs text-slate-400">
              Top Up • Joki • Jual Beli Akun
            </p>
          </div>

          <div className="flex items-center gap-3">
            {username && (
              <span className="text-sm text-slate-300">
                Halo, {username}
              </span>
            )}

            <button
              onClick={() => setShowAdmin(true)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm"
            >
              Admin
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black mb-3">
            Mau <span className="text-cyan-400">apa</span> hari ini?
          </h2>

          <p className="text-slate-400">
            Pilih layanan game yang lu butuhin.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => {
              setService("topup");
              setMessage("");
            }}
            className={`p-5 rounded-2xl border transition ${
              service === "topup"
                ? "border-cyan-400 bg-cyan-400/10"
                : "border-slate-700 bg-slate-800/60 hover:bg-slate-800"
            }`}
          >
            <div className="text-3xl mb-2">💎</div>
            <h3 className="font-bold">Top Up Game</h3>
            <p className="text-sm text-slate-400">
              Isi diamond, UC, VP dan lainnya.
            </p>
          </button>

          <button
            onClick={() => {
              setService("joki");
              setMessage("");
            }}
            className={`p-5 rounded-2xl border transition ${
              service === "joki"
                ? "border-purple-400 bg-purple-400/10"
                : "border-slate-700 bg-slate-800/60 hover:bg-slate-800"
            }`}
          >
            <div className="text-3xl mb-2">🏆</div>
            <h3 className="font-bold">Joki Game</h3>
            <p className="text-sm text-slate-400">
              Naikin rank game lu.
            </p>
          </button>

          <button
            onClick={() => {
              setService("akun");
              setMessage("");
            }}
            className={`p-5 rounded-2xl border transition ${
              service === "akun"
                ? "border-yellow-400 bg-yellow-400/10"
                : "border-slate-700 bg-slate-800/60 hover:bg-slate-800"
            }`}
          >
            <div className="text-3xl mb-2">🎮</div>
            <h3 className="font-bold">Jual Beli Akun</h3>
            <p className="text-sm text-slate-400">
              Cari akun game yang cocok.
            </p>
          </button>
        </div>

        <div className="bg-slate-800/70 border border-slate-700 rounded-3xl p-6 md:p-8">
          {service === "topup" && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Top Up Game</h3>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Pilih Game
                  </label>

                  <select
                    value={selectedGame}
                    onChange={(e) => {
                      setSelectedGame(e.target.value);
                      setSelectedNominal("");
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-cyan-400"
                  >
                    <option value="">Pilih game</option>

                    {GAMES.map((game) => (
                      <option key={game.id} value={game.id}>
                        {game.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Nominal
                  </label>

                  <select
                    value={selectedNominal}
                    onChange={(e) => setSelectedNominal(e.target.value)}
                    disabled={!selectedGame}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-cyan-400 disabled:opacity-50"
                  >
                    <option value="">Pilih nominal</option>

                    {(NOMINALS[selectedGame] || []).map((item) => (
                      <option key={item.label} value={item.label}>
                        {item.label} - {formatRp(item.price)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Nickname
                  </label>

                  <input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Nickname game"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    User ID
                  </label>

                  <input
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="User ID"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Server ID
                  </label>

                  <input
                    value={serverId}
                    onChange={(e) => setServerId(e.target.value)}
                    placeholder="Server ID (jika ada)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    WhatsApp
                  </label>

                  <input
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <button
                onClick={handleTopup}
                disabled={loading}
                className="mt-6 w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold disabled:opacity-50"
              >
                {loading ? "Mengirim..." : "Pesan Sekarang"}
              </button>
            </div>
          )}

          {service === "joki" && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Joki Game</h3>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Pilih Game
                  </label>

                  <select
                    value={selectedJokiGame}
                    onChange={(e) => {
                      setSelectedJokiGame(e.target.value);
                      setSelectedRank("");
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-purple-400"
                  >
                    <option value="">Pilih game</option>

                    {JOKI_GAMES.map((game) => (
                      <option key={game.id} value={game.id}>
                        {game.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Target Rank
                  </label>

                  <select
                    value={selectedRank}
                    onChange={(e) => setSelectedRank(e.target.value)}
                    disabled={!selectedJokiGame}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-purple-400 disabled:opacity-50"
                  >
                    <option value="">Pilih rank</option>

                    {(currentJokiGame?.ranks || []).map((rank) => (
                      <option key={rank} value={rank}>
                        {rank}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Nickname
                  </label>

                  <input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Nickname game"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    User ID
                  </label>

                  <input
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="User ID"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    WhatsApp
                  </label>

                  <input
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    Catatan
                  </label>

                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Catatan tambahan"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              {selectedRank && (
                <div className="mt-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                  <div className="flex justify-between">
                    <span>Harga joki</span>
                    <span className="font-bold">
                      {formatRp(jokiPrice)}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleJoki}
                disabled={loading}
                className="mt-6 w-full py-4 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold disabled:opacity-50"
              >
                {loading ? "Mengirim..." : "Pesan Joki"}
              </button>
            </div>
          )}

          {service === "akun" && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Jual Beli Akun</h3>

              <div className="grid md:grid-cols-3 gap-4">
                {AKUN_LIST.map((akun) => (
                  <button
                    key={akun.id}
                    onClick={() => setSelectedAkun(akun)}
                    className={`text-left p-5 rounded-2xl border transition ${
                      selectedAkun?.id === akun.id
                        ? "border-yellow-400 bg-yellow-400/10"
                        : "border-slate-700 bg-slate-900/60 hover:bg-slate-900"
                    }`}
                  >
                    <div className="text-sm text-yellow-400 font-semibold mb-2">
                      {akun.game}
                    </div>

                    <h4 className="font-bold text-lg mb-2">
                      {akun.rank}
                    </h4>

                    <p className="text-sm text-slate-400">
                      Level {akun.level}
                    </p>

                    <p className="text-sm text-slate-400 mt-2">
                      {akun.note}
                    </p>

                    <div className="mt-4 font-bold text-yellow-400">
                      {formatRp(akun.price)}
                    </div>
                  </button>
                ))}
              </div>

              {selectedAkun && (
                <div className="mt-6 grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">
                      WhatsApp
                    </label>

                    <input
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="08xxxxxxxxxx"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-2">
                      Catatan
                    </label>

                    <input
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Catatan tambahan"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleAkun}
                disabled={loading}
                className="mt-6 w-full py-4 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold disabled:opacity-50"
              >
                {loading ? "Mengirim..." : "Beli Akun"}
              </button>
            </div>
          )}

          {message && (
            <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-slate-700 text-center">
              {message}
            </div>
          )}
        </div>
      </main>

      <footer className="relative z-10 border-t border-slate-800 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-slate-500">
          © 2026 BarrStore — Top Up, Joki & Akun Game
        </div>
      </footer>
    </div>
  );
}

export default App;