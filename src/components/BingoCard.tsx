"use client";

import React from "react";

type BingoCell = { number: number; checked: boolean };
type BingoCardProps = {
  card: BingoCell[][];
  onNumberCheck: (number: number) => void;
};

const BingoCard: React.FC<BingoCardProps> = ({ card, onNumberCheck }) => {
  return (
    <div className="grid grid-cols-5 gap-2">
      {card.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <button
            key={`${rowIndex}-${colIndex}`}
            onClick={() => onNumberCheck(cell.number)}
            className={`w-12 h-12 text-center border ${
              cell.checked ? "bg-green-500" : "bg-white"
            }`}
          >
            {cell.number !== 0 ? cell.number : "FREE"}
          </button>
        ))
      )}
    </div>
  );
};

export default BingoCard;
