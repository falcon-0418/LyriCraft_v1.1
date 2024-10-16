import { test, expect } from '@playwright/test';

test('Authorizedページに遷移するテスト', async ({ page }) => {
  // Authorizedページにアクセス
  await page.goto('http://localhost:8000/Authorized');

  // ページのURLがAuthorizedページであることを確認
  await expect(page).toHaveURL(/\/Authorized/);

  // ページのコンテンツが正しく表示されていることを確認
  // ここでは、例えば "Welcome" というテキストが含まれているか確認する
  const welcomeMessage = await page.getByText(/Welcome/);
  await expect(welcomeMessage).toBeVisible();
});
