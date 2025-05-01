"use client";

import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";

type BingoCell = { number: number; checked: boolean };

type BingoCardProps = {
	card: BingoCell[][];
	onNumberCheck: (number: number) => void;
	isBingo?: boolean;
	isReach?: boolean;
};

const getReachNumber = (card: BingoCell[][]): number | null => {
	// 横のリーチチェック
	for (let i = 0; i < 5; i++) {
		const checkedCount = card[i].filter(
			(cell) => cell.checked || cell.number === 0,
		).length;
		if (checkedCount === 4) {
			const uncheckedCell = card[i].find(
				(cell) => !cell.checked && cell.number !== 0,
			);
			if (uncheckedCell) return uncheckedCell.number;
		}
	}

	// 縦のリーチチェック
	for (let i = 0; i < 5; i++) {
		const checkedCount = card.filter(
			(row) => row[i].checked || row[i].number === 0,
		).length;
		if (checkedCount === 4) {
			const uncheckedRow = card.find(
				(row) => !row[i].checked && row[i].number !== 0,
			);
			if (uncheckedRow) return uncheckedRow[i].number;
		}
	}

	// 斜めのリーチチェック（左上から右下）
	const diagonal1CheckedCount = card.filter(
		(row, i) => row[i].checked || row[i].number === 0,
	).length;
	if (diagonal1CheckedCount === 4) {
		const uncheckedIndex = card.findIndex(
			(row, i) => !row[i].checked && row[i].number !== 0,
		);
		if (uncheckedIndex !== -1)
			return card[uncheckedIndex][uncheckedIndex].number;
	}

	// 斜めのリーチチェック（右上から左下）
	const diagonal2CheckedCount = card.filter(
		(row, i) => row[4 - i].checked || row[4 - i].number === 0,
	).length;
	if (diagonal2CheckedCount === 4) {
		const uncheckedIndex = card.findIndex(
			(row, i) => !row[4 - i].checked && row[4 - i].number !== 0,
		);
		if (uncheckedIndex !== -1)
			return card[uncheckedIndex][4 - uncheckedIndex].number;
	}

	return null;
};

const getReachNumbers = (card: BingoCell[][]): number[] => {
	const reachNumbers: number[] = [];

	// 横のリーチチェック
	for (let i = 0; i < 5; i++) {
		const checkedCount = card[i].filter(
			(cell) => cell.checked || cell.number === 0,
		).length;
		if (checkedCount === 4) {
			const uncheckedCell = card[i].find(
				(cell) => !cell.checked && cell.number !== 0,
			);
			if (uncheckedCell) reachNumbers.push(uncheckedCell.number);
		}
	}

	// 縦のリーチチェック
	for (let i = 0; i < 5; i++) {
		const checkedCount = card.filter(
			(row) => row[i].checked || row[i].number === 0,
		).length;
		if (checkedCount === 4) {
			const uncheckedRow = card.find(
				(row) => !row[i].checked && row[i].number !== 0,
			);
			if (uncheckedRow) reachNumbers.push(uncheckedRow[i].number);
		}
	}

	// 斜めのリーチチェック（左上から右下）
	const diagonal1CheckedCount = card.filter(
		(row, i) => row[i].checked || row[i].number === 0,
	).length;
	if (diagonal1CheckedCount === 4) {
		const uncheckedIndex = card.findIndex(
			(row, i) => !row[i].checked && row[i].number !== 0,
		);
		if (uncheckedIndex !== -1)
			reachNumbers.push(card[uncheckedIndex][uncheckedIndex].number);
	}

	// 斜めのリーチチェック（右上から左下）
	const diagonal2CheckedCount = card.filter(
		(row, i) => row[4 - i].checked || row[4 - i].number === 0,
	).length;
	if (diagonal2CheckedCount === 4) {
		const uncheckedIndex = card.findIndex(
			(row, i) => !row[4 - i].checked && row[4 - i].number !== 0,
		);
		if (uncheckedIndex !== -1)
			reachNumbers.push(card[uncheckedIndex][4 - uncheckedIndex].number);
	}

	return reachNumbers;
};

const BingoCard: React.FC<BingoCardProps> = ({
	card,
	onNumberCheck,
	isBingo = false,
	isReach = false,
}) => {
	const [windowSize, setWindowSize] = useState({
		width: 0,
		height: 0,
	});

	useEffect(() => {
		console.log("isBingo status:", isBingo); // デバッグ用
		setWindowSize({
			width: window.innerWidth,
			height: window.innerHeight,
		});

		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [isBingo]); // isBingoの変更も監視

	console.log("Current windowSize:", windowSize); // デバッグ用
	console.log("Rendering BingoCard with isBingo:", isBingo); // デバッグ用

	const reachNumbers = isReach ? getReachNumbers(card) : [];

	const getCellStyle = (cell: BingoCell) => {
		if (cell.number === 0) return "bg-yellow-200 text-lg font-bold"; // FREEセル
		if (cell.checked)
			return "bg-green-500 text-white transition-all duration-300 transform scale-105"; // チェック済み
		if (isReach && reachNumbers.includes(cell.number)) {
			return "bg-white hover:bg-blue-100 focus:bg-blue-200 animate-pulse border-2 border-red-500 text-red-500 font-bold"; // リーチの残り1マス
		}
		return "bg-white hover:bg-blue-100 focus:bg-blue-200"; // 通常
	};

	return (
		<div className="space-y-4">
			{isBingo && (
				<>
					<div className="fixed inset-0 z-50" style={{ pointerEvents: "none" }}>
						<Confetti
							width={windowSize.width}
							height={windowSize.height}
							recycle={false}
							numberOfPieces={500}
							gravity={0.3}
							tweenDuration={5000}
						/>
					</div>
					<div
						className="fixed bottom-32 left-1/2 transform -translate-x-1/2
                        bg-gradient-to-r from-green-400 to-blue-500
                        text-white text-2xl font-bold px-8 py-4 rounded-lg shadow-xl
                        animate-bounce border-2 border-white"
					>
						🎉 BINGO! 🎉
					</div>
				</>
			)}

			{isReach && !isBingo && (
				<div
					className="fixed bottom-32 left-1/2 transform -translate-x-1/2
                      bg-gradient-to-r from-yellow-400 to-red-500
                      text-white text-xl font-bold px-6 py-3 rounded-lg shadow-lg
                      animate-pulse border-2 border-white"
				>
					<div className="text-center">🔥 REACH! 🔥</div>
					<div className="text-sm text-center mt-1">
						Waiting for number:
						<div className="mt-1">
							{reachNumbers.map((number) => (
								<span
									key={`reach-${number}`}
									className="ml-1 text-xl font-black bg-white text-red-500 px-2 py-0.5 rounded-md
                            animate-bounce inline-block transform hover:scale-110 transition-transform"
								>
									{number}
								</span>
							))}
						</div>
					</div>
				</div>
			)}

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
							type="button"
							key={`cell-${rowIndex}-${colIndex}-${cell.number}`}
							onClick={() => onNumberCheck(cell.number)}
							className={`w-16 h-16 border border-gray-300 rounded ${getCellStyle(
								cell,
							)}`}
						>
							{cell.number !== 0 ? cell.number : "FREE"}
						</button>
					)),
				)}
			</div>
		</div>
	);
};

export default BingoCard;
