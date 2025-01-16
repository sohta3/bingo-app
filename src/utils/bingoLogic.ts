export const generateBingoCard = (): {
  number: number;
  checked: boolean;
}[][] => {
  const card: { number: number; checked: boolean }[][] = [];
  for (let i = 0; i < 5; i++) {
    const numbers = Array.from({ length: 15 }, (_, k) => i * 15 + k + 1)
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
    card.push(numbers.map((num) => ({ number: num, checked: false })));
  }
  card[2][2] = { number: 0, checked: true }; // フリースペース
  return card;
};

export const checkNumberOnCard = (
  card: { number: number; checked: boolean }[][],
  number: number
) => {
  return card.map((row) =>
    row.map((cell) =>
      cell.number === number ? { ...cell, checked: true } : cell
    )
  );
};

export const isBingo = (card: { number: number; checked: boolean }[][]) => {
  if (card.length === 0) return false;

  const rows = card.some((row) => row.every((cell) => cell.checked));
  const cols = card[0].some((_, colIndex) =>
    card.every((row) => row[colIndex].checked)
  );
  const diagonals =
    card.every((row, idx) => row[idx].checked) ||
    card.every((row, idx) => row[4 - idx].checked);
  return rows || cols || diagonals;
};
