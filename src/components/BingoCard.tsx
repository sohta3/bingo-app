"use client";

import React from "react";

type BingoCell = { number: number; checked: boolean };

type BingoCardProps = {
  card: BingoCell[][];
  onNumberCheck: (number: number) => void;
};

const BingoCard: React.FC<BingoCardProps> = ({ card, onNumberCheck }) => {
  const getCellStyle = (cell: BingoCell) => {
    if (cell.number === 0) return "bg-yellow-200 text-lg font-bold"; // FREEセル
    if (cell.checked) return "bg-green-500 text-white"; // チェック済み
    return "bg-white hover:bg-blue-100 focus:bg-blue-200"; // 通常
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 text-center text-xl font-bold mb-4">
        {["B", "I", "N", "G", "O"].map((col) => (
          <div key={col} className="py-2 text-gray-700">
            {col}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {card.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => onNumberCheck(cell.number)}
              className={`w-16 h-16 border border-gray-300 rounded ${getCellStyle(
                cell
              )}`}
            >
              {cell.number !== 0 ? cell.number : "FREE"}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default BingoCard;
