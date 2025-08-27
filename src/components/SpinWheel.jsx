import { useEffect, useRef, useState } from "react";
import { getPrizes, addHistory } from "../api";

export default function SpinWheel({ onNewWinner }) {
  const canvasRef = useRef(null);
  const [prizes, setPrizes] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [winner, setWinner] = useState(null);

  const playerName = localStorage.getItem("id_pelanggan") || "Guest";

  useEffect(() => {
    getPrizes()
      .then((res) => setPrizes(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!prizes.length) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const size = canvas.width;
    const radius = size / 2;
    const arc = (2 * Math.PI) / prizes.length;

    ctx.clearRect(0, 0, size, size);

    const colors = [
      "#ef4444",
      "#eab308",
      "#22c55e",
      "#3b82f6",
      "#06b6d4",
      "#a855f7",
      "#f97316",
      "#84cc16",
    ];

    prizes.forEach((prize, i) => {
      const angleStart = arc * i + angle;

      ctx.beginPath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.moveTo(radius, radius);
      ctx.arc(radius, radius, radius, angleStart, angleStart + arc);
      ctx.fill();

      ctx.save();
      ctx.translate(radius, radius);
      ctx.rotate(angleStart + arc / 2);
      ctx.textAlign = "center";
      ctx.fillStyle = "#000";

      // Perbaikan agar tulisan panjang tidak terpotong
      ctx.font = "bold 14px sans-serif";
      let words = prize.name.split(" ");
      if (words.length > 1) {
        ctx.fillText(words[0], radius - 50, -10); // baris pertama
        ctx.fillText(words.slice(1).join(" "), radius - 50, 8); // baris kedua
      } else {
        ctx.fillText(prize.name, radius - 50, -5);
      }

      ctx.font = "12px sans-serif";
      ctx.fillText(`stok: ${prize.stock}`, radius - 50, 25);

      ctx.restore();
    });

    const img = new Image();
    img.src = "/logo-spin.jpg";
    img.onload = () => {
      const imgRadius = 40;
      ctx.save();
      ctx.beginPath();
      ctx.arc(radius, radius, imgRadius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(
        img,
        radius - imgRadius,
        radius - imgRadius,
        imgRadius * 2,
        imgRadius * 2
      );
      ctx.restore();
      ctx.beginPath();
      ctx.arc(radius, radius, imgRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 4;
      ctx.stroke();
    };
  }, [prizes, angle]);

  const spin = () => {
    if (spinning || !prizes.length) return;
    setSpinning(true);

    const spinSound = new Audio("/roda berputar.mp3");
    spinSound.play();

    const spinAngle = (Math.random() * 360 + 720) * (Math.PI / 180);
    const duration = 4000;
    const startTime = performance.now();
    const startAngle = angle;

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentAngle = startAngle + spinAngle * easeOut;
      setAngle(currentAngle);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        spinSound.pause();
        spinSound.currentTime = 0;

        const finalAngle = currentAngle % (2 * Math.PI);
        const segment = (2 * Math.PI) / prizes.length;
        const pointerAngle = (3 * Math.PI) / 2;
        let adjusted = pointerAngle - finalAngle;
        if (adjusted < 0) adjusted += 2 * Math.PI;
        const index = Math.floor(adjusted / segment);
        const prize = prizes[index];

        addHistory({ winner_name: playerName, prize_name: prize.name })
          .then(() =>
            onNewWinner?.({
              winner_name: playerName,
              prize_name: prize.name,
              date: new Date().toISOString(),
            })
          )
          .catch(console.error);

        setWinner(prize);

        const winSound = new Audio("/selamat.mp3");
        winSound.play();

        setSpinning(false);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 sm:p-8 bg-white rounded-lg shadow-lg w-full max-w-5xl">
      <h2 className="text-black font-bold text-lg">Spin Wheel</h2>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          style={{ border: "4px solid #333", borderRadius: "50%" }}
        />
        <div
          className="absolute left-1/2 -translate-x-1/2 -top-3"
          style={{
            width: 0,
            height: 0,
            borderLeft: "20px solid transparent",
            borderRight: "20px solid transparent",
            borderTop: "30px solid red",
          }}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-4 text-sm text-black">
        <span>Total Hadiah: {prizes.length}</span>
        <span>Bobot = stok</span>
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className={`px-6 py-2 rounded-lg font-bold transition ${
          spinning
            ? "bg-gray-500 cursor-not-allowed text-white"
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
      >
        {spinning ? "Memutar..." : "SPIN"}
      </button>

      {winner && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center animate-fadeIn w-[90%] max-w-sm">
            <div className="text-green-600 text-4xl mb-2">✔</div>
            <h2 className="text-xl font-bold mb-2">Selamat!</h2>
            <p>
              Anda mendapatkan hadiah: <b>{winner.name}</b>
            </p>
            <button
              onClick={() => setWinner(null)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
