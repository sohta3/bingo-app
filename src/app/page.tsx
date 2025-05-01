"use client";

import { useEffect, useState } from "react";
import BingoCard from "../components/BingoCard";
import {
  generateBingoCard,
  checkNumberOnCard,
  isBingo,
} from "../utils/bingoLogic";

type BingoCell = {
  number: number;
  checked: boolean;
};

const isReach = (card: BingoCell[][]) => {
  // カードが空の場合はリーチではない
  if (!card || card.length === 0) return false;

  // 横のリーチチェック
  for (let i = 0; i < 5; i++) {
    const checkedCount = card[i].filter(
      (cell) => cell.checked || cell.number === 0
    ).length;
    if (
      checkedCount === 4 &&
      card[i].some((cell) => !cell.checked && cell.number !== 0)
    )
      return true;
  }

  // 縦のリーチチェック
  for (let i = 0; i < 5; i++) {
    const checkedCount = card.filter(
      (row) => row[i].checked || row[i].number === 0
    ).length;
    if (
      checkedCount === 4 &&
      card.some((row) => !row[i].checked && row[i].number !== 0)
    )
      return true;
  }

  // 斜めのリーチチェック（左上から右下）
  const diagonal1CheckedCount = card.filter(
    (row, i) => row[i].checked || row[i].number === 0
  ).length;
  const diagonal1Unchecked = card.some(
    (row, i) => !row[i].checked && row[i].number !== 0
  );
  if (diagonal1CheckedCount === 4 && diagonal1Unchecked) return true;

  // 斜めのリーチチェック（右上から左下）
  const diagonal2CheckedCount = card.filter(
    (row, i) => row[4 - i].checked || row[4 - i].number === 0
  ).length;
  const diagonal2Unchecked = card.some(
    (row, i) => !row[4 - i].checked && row[4 - i].number !== 0
  );
  if (diagonal2CheckedCount === 4 && diagonal2Unchecked) return true;

  return false;
};

export default function Home() {
  const [bingoCard, setBingoCard] = useState<
    { number: number; checked: boolean }[][]
  >([]);
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);

  const callNumber = () => {
    const availableNumbers = Array.from({ length: 75 }, (_, i) => i + 1).filter(
      (n) => !calledNumbers.includes(n)
    );
    if (availableNumbers.length === 0) return;
    const newNumber =
      availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
    setCalledNumbers([...calledNumbers, newNumber]);
    setBingoCard(checkNumberOnCard(bingoCard, newNumber));
  };

  const reach = isReach(bingoCard);
  const bingo = isBingo(bingoCard);

  useEffect(() => {
    setBingoCard(generateBingoCard());
  }, []);

  return (
    <main className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Bingo Game</h1>
      <BingoCard
        card={bingoCard}
        onNumberCheck={() => {}}
        isBingo={bingo}
        isReach={reach}
      />
      <button
        onClick={() => setBingoCard(generateBingoCard())}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
      >
        GET A NEW CARD
      </button>
      <button
        onClick={callNumber}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
      >
        Call Number
      </button>
      <div className="mt-4">
        <h2 className="text-xl text-gray-700">
          Called Numbers: {calledNumbers.join(", ")}
        </h2>
        {bingo && <p className="text-green-600 text-2xl mt-2">BINGO!</p>}
      </div>
    </main>
  );
}
