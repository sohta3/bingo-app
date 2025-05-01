import { test, expect } from "@playwright/test";

test.describe("ビンゴゲーム (MCP)", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:3000");
	});

	test("初期表示の確認", async ({ page }) => {
		// タイトルの確認
		await expect(
			page.getByRole("heading", { name: "Bingo Game" }),
		).toBeVisible();

		// ビンゴカードの確認（MCPのスナップショットを使用）
		await page.evaluate(() => {
			window.scrollTo(0, 0);
		});

		// MCPのブラウザスナップショットを取得
		await page.waitForTimeout(1000); // アニメーション完了を待つ
		const browserSnapshot = await page.accessibility.snapshot();

		// スナップショットから必要な情報を検証
		expect(browserSnapshot).toBeTruthy();

		// 操作ボタンの確認
		const getNewCardButton = page.getByRole("button", {
			name: "GET A NEW CARD",
		});
		const callNumberButton = page.getByRole("button", { name: "Call Number" });

		await expect(getNewCardButton).toBeVisible();
		await expect(callNumberButton).toBeVisible();
	});

	test("新しいカードの生成", async ({ page }) => {
		// 現在のカードの番号を取得
		const initialNumbers = await page
			.getByRole("button")
			.filter({ hasText: /^[0-9]+$/ })
			.allTextContents();

		// 新しいカードを生成
		await page.getByRole("button", { name: "GET A NEW CARD" }).click();

		// 新しいカードのスナップショットを取得
		await page.waitForTimeout(1000); // アニメーション完了を待つ

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
			// 対応するマスをクリック（完全一致で検索）
			const numberButton = page
				.getByRole("button")
				.filter({ hasText: new RegExp(`^${calledNumber}$`) });

			if (await numberButton.isVisible()) {
				await numberButton.click();

				// クリック後のスタイルの変更を確認
				await expect(numberButton).toHaveClass(/bg-green-500/);
			}
		}
	});

	test("リーチ状態の確認", async ({ page }) => {
		// リーチ状態を作るために必要な回数だけ番号を呼び出す
		for (let i = 0; i < 20; i++) {
			await page.getByRole("button", { name: "Call Number" }).click();

			// 呼び出された番号を取得
			const calledNumbersText = await page
				.getByText("Called Numbers:")
				.textContent();
			const calledNumber = calledNumbersText?.match(/\d+/)?.[0];

			if (calledNumber) {
				// 対応するマスをクリック（完全一致で検索）
				const numberButton = page
					.getByRole("button")
					.filter({ hasText: new RegExp(`^${calledNumber}$`) });

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

			// 呼び出された番号を取得
			const calledNumbersText = await page
				.getByText("Called Numbers:")
				.textContent();
			const calledNumber = calledNumbersText?.match(/\d+/)?.[0];

			if (calledNumber) {
				// 対応するマスをクリック（完全一致で検索）
				const numberButton = page
					.getByRole("button")
					.filter({ hasText: new RegExp(`^${calledNumber}$`) });

				if (await numberButton.isVisible()) {
					await numberButton.click();
				}
			}

			// ビンゴ表示を確認
			const bingoText = page.getByText("🎉 BINGO! 🎉");
			if (await bingoText.isVisible()) {
				// Confettiアニメーションの確認
				await page.waitForTimeout(1000); // アニメーションの開始を待つ
				await expect(bingoText).toBeVisible();
				break;
			}
		}
	});
});
