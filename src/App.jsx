import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import SpinWheel from "./components/SpinWheel";
import WinnerTable from "./components/WinnerTable";
import { getHistory } from "./api";
import Login from "./components/LoginForm";

function Home({ onLogout }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await getHistory();
        setHistory(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
  }, []);

  const handleNewWinner = (winner) => setHistory((prev) => [winner, ...prev]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full max-w-5xl mb-6 space-y-4 sm:space-y-0">
        {/* Logo */}
        <img
          src="/logo-kapten.png"
          alt="Kapten Naratel"
          className="h-12 sm:h-16 w-auto mx-auto sm:mx-0"
        />

        {/* Judul agak ditengah */}
        <h1 className="text-2xl sm:text-3xl font-bold flex-1 text-center">
          Spin Wheel Kapten Naratel
        </h1>

        {/* Tombol Logout */}
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-auto sm:mx-0"
        >
          Logout
        </button>
      </div>

      <SpinWheel onNewWinner={handleNewWinner} />
      <WinnerTable history={history} />
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(localStorage.getItem("id_pelanggan") || null);

  const handleLogin = (id) => setUser(id);
  const handleLogout = () => {
    localStorage.removeItem("id_pelanggan");
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {!user ? (
          <>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Login onLogin={handleLogin} />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Home onLogout={handleLogout} />} />
            <Route path="*" element={<Home onLogout={handleLogout} />} />
          </>
        )}
      </Routes>
    </Router>
  );
}
