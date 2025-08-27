import { useState } from "react";

export default function Login({ onLogin }) {
  const [idPelanggan, setIdPelanggan] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!idPelanggan.trim()) {
      setMsg("ID Pelanggan tidak boleh kosong!");
      return;
    }

    localStorage.setItem("id_pelanggan", idPelanggan.trim());
    onLogin(idPelanggan.trim());
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative px-4"
      style={{
        background: "linear-gradient(to bottom, #fcd34d, #f97316)",
      }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center opacity-20"
        style={{
          backgroundImage: "url('/logo-kapten.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />

      <form
        onSubmit={handleSubmit}
        className="relative bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
          Login Kapten Naratel
        </h2>
        {msg && <p className="text-red-500 mb-2 text-center">{msg}</p>}
        <input
          type="text"
          name="id_pelanggan"
          placeholder="Masukkan ID Pelanggan"
          value={idPelanggan}
          onChange={(e) => setIdPelanggan(e.target.value)}
          className="w-full border p-2 mb-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded shadow-md hover:bg-orange-600 transition duration-200"
        >
          Login
        </button>
      </form>
    </div>
  );
}
