import { useEffect, useState } from "react";
import SpinWheel from "../components/SpinWheel";
import WinnerTable from "../components/WinnerTable";
import axios from "axios";

export default function Home({ user, onLogout }) {
  const [hadiahList, setHadiahList] = useState([]);
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    axios.get("/api/hadiah").then((res) => setHadiahList(res.data));
    axios.get("/api/pemenang").then((res) => setWinners(res.data));
  }, []);

  const handleWin = (hadiah) => {
    axios
      .post("/api/pemenang", {
        hadiah_id: hadiah.id,
        pelanggan_id: user.id,
      })
      .then(() => {
        setWinners((prev) => [
          ...prev,
          {
            nama_pelanggan: user.nama_pelanggan,
            nama_hadiah: hadiah.nama_hadiah,
            tanggal_menang: new Date().toISOString(),
          },
        ]);
      });
  };

  return (
    <div className="flex flex-col items-center gap-8 p-6">
      <div className="self-end">
        <button
          onClick={onLogout}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          LOGOUT
        </button>
      </div>
      <SpinWheel hadiahList={hadiahList} onWin={handleWin} />
      <WinnerTable winners={winners} />
    </div>
  );
}
