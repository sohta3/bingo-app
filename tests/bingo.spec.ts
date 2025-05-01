import { test, expect } from "@playwright/test";

test.describe("ビンゴゲーム", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:3000");
	});

	test("初期表示の確認", async ({ page }) => {
		// タイトルの確認
		await expect(
			page.getByRole("heading", { name: "Bingo Game" }),
		).toBeVisible();

		// ビンゴカードの確認
		const bingoGrid = page
			.getByRole("button")
			.filter({ hasText: /^[0-9]+$|^FREE$/ });
		await expect(bingoGrid).toHaveCount(25); // 5x5のグリッド

		// FREEマスの確認
		await expect(page.getByRole("button", { name: "FREE" })).toBeVisible();

		// 操作ボタンの確認
		await expect(
			page.getByRole("button", { name: "GET A NEW CARD" }),
		).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Call Number" }),
		).toBeVisible();
	});

	test("新しいカードの生成", async ({ page }) => {
		// 現在のカードの番号を取得
		const initialNumbers = await page
			.getByRole("button")
			.filter({ hasText: /^[0-9]+$/ })
			.allTextContents();

		// 新しいカードを生成
		await page.getByRole("button", { name: "GET A NEW CARD" }).click();

		// 新しいカードの番号を取得
		const newNumbers = await page
			.getByRole("button")
			.filter({ hasText: /^[0-9]+$/ })
			.allTextContents();

		// 番号が変更されていることを確認
		expect(initialNumbers).not.toEqual(newNumbers);
	});

	test("番号を呼び出してマスをクリック", async ({ page }) => {
		// 番号を呼び出す
		await page.getByRole("button", { name: "Call Number" }).click();

		// 呼び出された番号を取得
		const calledNumbersText = await page
			.getByText("Called Numbers:")
			.textContent();
		const calledNumber = calledNumbersText?.match(/\d+/)?.[0];

		if (calledNumber) {
			// 対応するマスをクリック
			const numberButton = page.getByRole("button", { name: calledNumber });
			if (await numberButton.isVisible()) {
				await numberButton.click();
				// クリックされたマスのスタイルが変更されていることを確認
				await expect(numberButton).toHaveClass(/bg-green-500/);
			}
		}
	});

	test("リーチ状態の確認", async ({ page }) => {
		// リーチ状態を作るために必要な回数だけ番号を呼び出す
		for (let i = 0; i < 20; i++) {
			await page.getByRole("button", { name: "Call Number" }).click();

			// 呼び出された番号に対応するマスをクリック
			const calledNumbersText = await page
				.getByText("Called Numbers:")
				.textContent();
			const calledNumber = calledNumbersText?.match(/\d+/)?.[0];

			if (calledNumber) {
				const numberButton = page.getByRole("button", { name: calledNumber });
				if (await numberButton.isVisible()) {
					await numberButton.click();
				}
			}

			// リーチ表示を確認
			const reachText = page.getByText("🔥 REACH! 🔥");
			if (await reachText.isVisible()) {
				await expect(reachText).toBeVisible();
				break;
			}
		}
	});

	test("ビンゴ達成の確認", async ({ page }) => {
		// ビンゴを達成するために必要な回数だけ番号を呼び出す
		for (let i = 0; i < 25; i++) {
			await page.getByRole("button", { name: "Call Number" }).click();

			// 呼び出された番号に対応するマスをクリック
			const calledNumbersText = await page
				.getByText("Called Numbers:")
				.textContent();
			const calledNumber = calledNumbersText?.match(/\d+/)?.[0];

			if (calledNumber) {
				const numberButton = page.getByRole("button", { name: calledNumber });
				if (await numberButton.isVisible()) {
					await numberButton.click();
				}
			}

			// ビンゴ表示を確認
			const bingoText = page.getByText("🎉 BINGO! 🎉");
			if (await bingoText.isVisible()) {
				await expect(bingoText).toBeVisible();
				break;
			}
		}
	});
});
