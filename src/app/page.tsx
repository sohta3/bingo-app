"use client";

import { useEffect, useState } from "react";
import BingoCard from "../components/BingoCard";
import {
  generateBingoCard,
  checkNumberOnCard,
  isBingo,
} from "../utils/bingoLogic";

export default function Home() {
  const [bingoCard, setBingoCard] = useState<
    { number: number; checked: boolean }[][]
  >([]);
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);

  useEffect(() => {
    setBingoCard(generateBingoCard()); // クライアント側で初期化
  }, []);

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

  const bingo = isBingo(bingoCard);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">ビンゴゲーム</h1>
      <BingoCard card={bingoCard} onNumberCheck={() => {}} />
      <button
        onClick={callNumber}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
      >
        番号をコール
      </button>
      <div className="mt-4">
        <h2>コールされた番号: {calledNumbers.join(", ")}</h2>
        {bingo && <p className="text-green-600 text-xl mt-2">ビンゴ成立！</p>}
      </div>
    </main>
  );
}
