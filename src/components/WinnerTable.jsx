import { useState } from "react";

const ROWS_PER_PAGE = 10;

export default function WinnerTable({ history }) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(history.length / ROWS_PER_PAGE);

  const currentRows = history.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  const handlePrev = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));

  return (
    <div className="p-4 bg-white rounded-lg shadow mt-6 w-full max-w-5xl overflow-x-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Pemenang Terbaru</h2>
      <table className="w-full border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-gray-200 text-gray-800">
            <th className="px-4 py-2 border">Nama Pemenang</th>
            <th className="px-4 py-2 border">Hadiah</th>
            <th className="px-4 py-2 border">Tanggal</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.length === 0 ? (
            <tr>
              <td colSpan="3" className="px-4 py-2 text-center text-gray-600">
                Belum ada pemenang.
              </td>
            </tr>
          ) : (
            currentRows.map((r, i) => (
              <tr
                key={r.id || i}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-2 border text-gray-800">
                  {r.winner_name}
                </td>
                <td className="px-4 py-2 border text-gray-800">
                  {r.prize_name}
                </td>
                <td className="px-4 py-2 border text-gray-800">
                  {new Date(r.date).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {history.length > ROWS_PER_PAGE && (
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-gray-700">
            Halaman {page} dari {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
