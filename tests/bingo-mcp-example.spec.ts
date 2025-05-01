import { test, expect } from "@playwright/test";

test.describe("ビンゴゲーム (MCP Example)", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:3000");
	});

	test("番号を呼び出してマスをクリック", async ({ page }) => {
		// MCPのスナップショットを取得
		const initialSnapshot = await page.accessibility.snapshot();

		// Call Numberボタンを見つけてクリック
		await page.evaluate(() => {
			const button = document.querySelector("button");
			if (button?.textContent === "Call Number") {
				window.mcp.click({
					element: "Call Number button",
					ref: button,
				});
			}
		});

		// 呼び出された番号を取得
		const calledNumbersText = await page.evaluate(() => {
			const element = document.querySelector("h2");
			return element?.textContent || "";
		});
		const calledNumber = calledNumbersText.match(/\d+/)?.[0];

		if (calledNumber) {
			// MCPのスナップショットから対応するビンゴマスを見つける
			await page.evaluate((number) => {
				const buttons = Array.from(document.querySelectorAll("button"));
				const targetButton = buttons.find(
					(button) => button.textContent === number,
				);
				if (targetButton) {
					window.mcp.click({
						element: `Bingo number ${number}`,
						ref: targetButton,
					});
				}
			}, calledNumber);

			// クリック後の状態を確認
			const afterClickSnapshot = await page.accessibility.snapshot();
			const clickedButton = afterClickSnapshot.find(
				(element) =>
					element.role === "button" &&
					element.name === calledNumber &&
					element.className?.includes("bg-green-500"),
			);

			expect(clickedButton).toBeTruthy();
		}
	});
});
