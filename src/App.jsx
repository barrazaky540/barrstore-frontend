import { useState, useEffect } from "react";
import {
  GAMES,
  NOMINALS,
  JOKI_GAMES,
  JOKI_PRICE_PER_TIER,
  AKUN_LIST,
  formatRp
} from "./data";

function App() {
  const [service, setService] = useState("topup");

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 relative overflow-hidden">

      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-[200px] left-[-150px] w-[350px] h-[350px] bg-teal-400/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="absolute top-[80px] right-[80px] text-[120px] opacity-[0.06] pointer-events-none select-none rotate-12">
        🎮
      </div>

      <div className="absolute top-[400px] right-[200px] text-[100px] opacity-[0.05] pointer-events-none select-none -rotate-12">
        🕹️
      </div>

      <div className="absolute top-[600px] left-[50px] text-[90px] opacity-[0.05] pointer-events-none select-none rotate-6">
        👾
      </div>

      <div className="absolute top-[900px] right-[100px] text-[110px] opacity-[0.05] pointer-events-none select-none -rotate-6">
        🎯
      </div>

      <div className="absolute top-[1200px] left-[100px] text-[100px] opacity-[0.05] pointer-events-none select-none rotate-12">
        🏆
      </div>

      <header className="border-b border-slate-800 p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-teal-400 flex items-center justify-center font-extrabold text-slate-900">
          BS
        </div>

        <span className="font-bold text-lg">BarrStore</span>
      </header>

      <main className="max-w-4xl mx-auto p-6">

        <div className="mb-10">
          <p className="text-teal-400 font-semibold text-sm mb-2">
            Top up • Joki rank • Jual beli akun
          </p>

          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3">
            Semua kebutuhan akun gaming-mu, beres di satu tempat.
          </h1>

          <p className="text-slate-400 max-w-xl">
            Proses instan, harga transparan, tanpa drama.
          </p>
        </div>

        <div className="flex gap-3 mb-8">

          <button
            onClick={() => setService("topup")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              service === "topup"
                ? "bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/30"
                : "bg-slate-800 border border-slate-700 hover:border-teal-500"
            }`}
          >
            Top Up
          </button>

          <button
            onClick={() => setService("joki")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              service === "joki"
                ? "bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/30"
                : "bg-slate-800 border border-slate-700 hover:border-teal-500"
            }`}
          >
            Joki Rank
          </button>

          <button
            onClick={() => setService("akun")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              service === "akun"
                ? "bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/30"
                : "bg-slate-800 border border-slate-700 hover:border-teal-500"
            }`}
          >
            Jual Akun
          </button>

        </div>

        {service === "topup" && <TopUpPanel />}
        {service === "joki" && <JokiPanel />}
        {service === "akun" && <AkunPanel />}

      </main>

      <footer className="border-t border-slate-800 mt-16 py-8 text-center text-slate-500 text-sm">
        © 2027 BarrStore — Top up, joki rank, dan jual beli akun gaming.
      </footer>

    </div>
  );
}


/* =========================
   TOP UP
========================= */

function TopUpPanel() {

  const [gamesFromServer, setGamesFromServer] = useState([]);

  useEffect(() => {
    fetch("https://barrstore-backend.vercel.app/api/games")
      .then((res) => res.json())
      .then((data) => setGamesFromServer(data))
      .catch(() => {
        setGamesFromServer(GAMES);
      });
  }, []);

  const [gameId, setGameId] = useState("ml");
  const [nominalIdx, setNominalIdx] = useState(null);

  const [userId, setUserId] = useState("");
  const [serverId, setServerId] = useState("");
  const [nickname, setNickname] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [note, setNote] = useState("");

  const nominal =
    nominalIdx !== null
      ? NOMINALS[gameId][nominalIdx]
      : null;

  const handleOrder = () => {

    if (
      !userId ||
      !nickname ||
      !whatsapp ||
      !nominal ||
      (gameId === "ml" && !serverId)
    ) {
      alert("Lengkapi semua data terlebih dahulu");
      return;
    }

    alert(
      `Pesanan Top Up berhasil dibuat!\n\n` +
      `Game: ${gameId.toUpperCase()}\n` +
      `Nickname: ${nickname}\n` +
      `User ID: ${userId}\n` +
      `${gameId === "ml" ? `Server/Zone: ${serverId}\n` : ""}` +
      `WhatsApp: ${whatsapp}\n` +
      `Nominal: ${nominal.label}\n` +
      `Total: ${formatRp(nominal.price)}`
    );

    setUserId("");
    setServerId("");
    setNickname("");
    setWhatsapp("");
    setNote("");
    setNominalIdx(null);
  };

  return (
    <div>

      <h2 className="font-bold text-lg mb-3">
        1. Pilih game
      </h2>

      <div className="flex gap-3 flex-wrap mb-6">

        {gamesFromServer.map((g) => (

          <button
            key={g.id}
            onClick={() => {
              setGameId(g.id);
              setNominalIdx(null);
              setServerId("");
            }}
            className={`px-4 py-2 rounded-lg border text-sm ${
              gameId === g.id
                ? "border-amber-400 bg-slate-800"
                : "border-slate-700 bg-slate-800/50"
            }`}
          >
            {g.icon} {g.name}
          </button>

        ))}

      </div>


      <h2 className="font-bold text-lg mb-3">
        2. Pilih nominal
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">

        {NOMINALS[gameId].map((n, i) => (

          <div
            key={n.label}
            onClick={() => setNominalIdx(i)}
            className={`p-4 rounded-lg border cursor-pointer ${
              nominalIdx === i
                ? "border-amber-400 bg-slate-800"
                : "border-slate-700 bg-slate-800/50"
            }`}
          >

            <div className="text-sm">
              {n.label}
            </div>

            <div className="text-amber-400 font-bold">
              {formatRp(n.price)}
            </div>

          </div>

        ))}

      </div>


      <h2 className="font-bold text-lg mb-3">
        3. Data Pembeli & Akun
      </h2>

      <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mb-6">

        <div>
          <label className="text-xs text-slate-400 mb-1 block">
            User ID
          </label>

          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Contoh: 123456789"
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm w-full"
          />
        </div>


        {gameId === "ml" && (
          <div>
            <label className="text-xs text-slate-400 mb-1 block">
              Server / Zone ID
            </label>

            <input
              value={serverId}
              onChange={(e) => setServerId(e.target.value)}
              placeholder="Contoh: 1234"
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm w-full"
            />
          </div>
        )}


        <div>
          <label className="text-xs text-slate-400 mb-1 block">
            Nickname
          </label>

          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Nickname dalam game"
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm w-full"
          />
        </div>


        <div>
          <label className="text-xs text-slate-400 mb-1 block">
            Nomor WhatsApp
          </label>

          <input
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="08xxxxxxxxxx"
            type="tel"
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm w-full"
          />
        </div>


        <div className="sm:col-span-2">

          <label className="text-xs text-slate-400 mb-1 block">
            Catatan Tambahan
          </label>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Contoh: Tolong proses secepatnya"
            rows="3"
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm w-full"
          />

        </div>

      </div>


      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 max-w-sm">

        <div className="text-sm text-slate-400 mb-2">
          Ringkasan Pesanan
        </div>

        <div className="mb-1">
          Nickname: <b>{nickname || "-"}</b>
        </div>

        <div className="mb-1">
          User ID: <b>{userId || "-"}</b>
        </div>

        {gameId === "ml" && (
          <div className="mb-1">
            Server: <b>{serverId || "-"}</b>
          </div>
        )}

        <div className="mb-1">
          Nominal: <b>{nominal ? nominal.label : "-"}</b>
        </div>

        <div className="text-lg font-bold text-amber-400 mb-4">
          Total: {nominal ? formatRp(nominal.price) : "Rp 0"}
        </div>

        <button
          onClick={handleOrder}
          className="w-full bg-amber-400 text-slate-900 font-semibold py-2 rounded-lg"
        >
          Proses Top Up
        </button>

      </div>

    </div>
  );
}


/* =========================
   JOKI
========================= */

function JokiPanel() {

  const [jokiGamesFromServer, setJokiGamesFromServer] =
    useState([]);

  useEffect(() => {

    fetch("https://barrstore-backend.vercel.app/api/joki-games")
      .then((res) => res.json())
      .then((data) => setJokiGamesFromServer(data))
      .catch(() => {
        setJokiGamesFromServer(JOKI_GAMES);
      });

  }, []);


  const [gameId, setGameId] = useState("ml");
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(2);

  const [userId, setUserId] = useState("");
  const [serverId, setServerId] = useState("");
  const [nickname, setNickname] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [note, setNote] = useState("");


  const game = jokiGamesFromServer.find(
    (g) => g.id === gameId
  );

  const gap = Math.max(
    0,
    toIdx - fromIdx
  );

  const price =
    gap * JOKI_PRICE_PER_TIER;


  const handleGameChange = (id) => {

    setGameId(id);
    setFromIdx(0);
    setToIdx(1);
    setServerId("");

  };


  const handleOrder = () => {

    if (
      !userId ||
      !nickname ||
      !whatsapp ||
      !loginUsername ||
      !loginPassword ||
      gap <= 0 ||
      (gameId === "ml" && !serverId)
    ) {

      alert(
        "Lengkapi semua data joki terlebih dahulu"
      );

      return;
    }


    alert(
      `Pesanan Joki berhasil dibuat!\n\n` +
      `Game: ${game.name}\n` +
      `Nickname: ${nickname}\n` +
      `User ID: ${userId}\n` +
      `${gameId === "ml" ? `Server/Zone: ${serverId}\n` : ""}` +
      `Rank: ${game.ranks[fromIdx]} → ${game.ranks[toIdx]}\n` +
      `WhatsApp: ${whatsapp}\n` +
      `Total: ${formatRp(price)}`
    );


    setUserId("");
    setServerId("");
    setNickname("");
    setWhatsapp("");
    setLoginUsername("");
    setLoginPassword("");
    setNote("");

  };


  if (!game) {
    return <p>Memuat data...</p>;
  }


  return (
    <div>

      <h2 className="font-bold text-lg mb-3">
        1. Pilih game
      </h2>

      <div className="flex gap-3 flex-wrap mb-6">

        {jokiGamesFromServer.map((g) => (

          <button
            key={g.id}
            onClick={() => handleGameChange(g.id)}
            className={`px-4 py-2 rounded-lg border text-sm ${
              gameId === g.id
                ? "border-amber-400 bg-slate-800"
                : "border-slate-700 bg-slate-800/50"
            }`}
          >
            {g.name}
          </button>

        ))}

      </div>


      <h2 className="font-bold text-lg mb-3">
        2. Rank sekarang → rank target
      </h2>


      <div className="grid sm:grid-cols-2 gap-4 mb-6 max-w-lg">

        <div>

          <label className="text-xs text-slate-400 mb-1 block">
            Rank sekarang
          </label>

          <select
            value={fromIdx}
            onChange={(e) =>
              setFromIdx(Number(e.target.value))
            }
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-3 text-sm"
          >

            {game.ranks.map((r, i) => (

              <option key={r} value={i}>
                {r}
              </option>

            ))}

          </select>

        </div>


        <div>

          <label className="text-xs text-slate-400 mb-1 block">
            Rank target
          </label>

          <select
            value={toIdx}
            onChange={(e) =>
              setToIdx(Number(e.target.value))
            }
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-3 text-sm"
          >

            {game.ranks.map((r, i) => (

              <option key={r} value={i}>
                {r}
              </option>

            ))}

          </select>

        </div>

      </div>


      <h2 className="font-bold text-lg mb-3">
        3. Data Akun & Kontak
      </h2>


      <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mb-6">

        <div>

          <label className="text-xs text-slate-400 mb-1 block">
            User ID
          </label>

          <input
            value={userId}
            onChange={(e) =>
              setUserId(e.target.value)
            }
            placeholder="User ID akun"
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm w-full"
          />

        </div>


        {gameId === "ml" && (
          <div>

            <label className="text-xs text-slate-400 mb-1 block">
              Server / Zone ID
            </label>

            <input
              value={serverId}
              onChange={(e) =>
                setServerId(e.target.value)
              }
              placeholder="Server / Zone ID"
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm w-full"
            />

          </div>
        )}


        <div>

          <label className="text-xs text-slate-400 mb-1 block">
            Nickname
          </label>

          <input
            value={nickname}
            onChange={(e) =>
              setNickname(e.target.value)
            }
            placeholder="Nickname dalam game"
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm w-full"
          />

        </div>


        <div>

          <label className="text-xs text-slate-400 mb-1 block">
            Nomor WhatsApp
          </label>

          <input
            value={whatsapp}
            onChange={(e) =>
              setWhatsapp(e.target.value)
            }
            placeholder="08xxxxxxxxxx"
            type="tel"
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm w-full"
          />

        </div>


        <div>

          <label className="text-xs text-slate-400 mb-1 block">
            Email / Username Akun
          </label>

          <input
            value={loginUsername}
            onChange={(e) =>
              setLoginUsername(e.target.value)
            }
            placeholder="Email atau username akun"
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm w-full"
          />

        </div>


        <div>

          <label className="text-xs text-slate-400 mb-1 block">
            Password Akun
          </label>

          <input
            value={loginPassword}
            onChange={(e) =>
              setLoginPassword(e.target.value)
            }
            placeholder="Password akun"
            type="password"
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm w-full"
          />

        </div>


        <div className="sm:col-span-2">

          <label className="text-xs text-slate-400 mb-1 block">
            Catatan Tambahan
          </label>

          <textarea
            value={note}
            onChange={(e) =>
              setNote(e.target.value)
            }
            placeholder="Contoh: Target harus selesai hari ini"
            rows="3"
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm w-full"
          />

        </div>

      </div>


      <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 max-w-sm">

        <div className="text-sm text-slate-400 mb-2">
          Ringkasan Joki
        </div>

        <div className="mb-1">
          Nickname: <b>{nickname || "-"}</b>
        </div>

        <div className="mb-1">
          User ID: <b>{userId || "-"}</b>
        </div>

        {gameId === "ml" && (
          <div className="mb-1">
            Server: <b>{serverId || "-"}</b>
          </div>
        )}

        <div className="mb-1">
          {game.ranks[fromIdx]} →{" "}
          <b>{game.ranks[toIdx]}</b>
        </div>

        <div className="mb-1">
          Jarak tier: {gap}
        </div>

        <div className="text-lg font-bold text-amber-400 mb-4">
          Total: {formatRp(price)}
        </div>

        <button
          onClick={handleOrder}
          className="w-full bg-amber-400 text-slate-900 font-semibold py-2 rounded-lg"
        >
          Pesan Joki Rank
        </button>

      </div>

    </div>
  );
}


/* =========================
   JUAL AKUN
========================= */

function AkunPanel() {

  const [akunFromServer, setAkunFromServer] =
    useState([]);

  const [query, setQuery] =
    useState("");


  useEffect(() => {

    fetch("https://barrstore-backend.vercel.app/api/akun")
      .then((res) => res.json())
      .then((data) => setAkunFromServer(data))
      .catch(() => {
        setAkunFromServer(AKUN_LIST);
      });

  }, []);


  const filtered =
    akunFromServer.filter((a) =>
      a.game
        .toLowerCase()
        .includes(query.toLowerCase())
    );


  return (
    <div>

      <input
        value={query}
        onChange={(e) =>
          setQuery(e.target.value)
        }
        placeholder="Cari akun berdasarkan game..."
        className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm w-full max-w-sm mb-6"
      />


      <div className="grid sm:grid-cols-2 gap-4">

        {filtered.map((a) => (

          <div
            key={a.id}
            className="bg-slate-800 border border-slate-700 rounded-lg p-5"
          >

            <div className="text-xs text-teal-400 font-semibold mb-1">
              {a.game}
            </div>

            <div className="font-bold text-lg">
              {a.rank}
            </div>

            <div className="text-xs text-slate-400 mb-2">
              Level {a.level}
            </div>

            <p className="text-sm text-slate-300 mb-3">
              {a.note}
            </p>

            <div className="flex items-center justify-between">

              <span className="font-bold text-amber-400">
                {formatRp(a.price)}
              </span>

              <button
                onClick={() =>
                  alert(
                    `Pesanan akun ${a.game} - ${a.rank} dikirim ke penjual (demo)`
                  )
                }
                className="bg-teal-400 text-slate-900 text-sm font-semibold px-4 py-2 rounded-lg"
              >
                Beli
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}


export default App;