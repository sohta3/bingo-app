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

  useEffect(() => {
    setBingoCard(generateBingoCard());
  }, []);

  return (
    <main className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Bingo Game</h1>
      <BingoCard card={bingoCard} onNumberCheck={() => {}} />
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
