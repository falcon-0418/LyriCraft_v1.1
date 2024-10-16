import { test, expect } from '@playwright/test';

test('PCサイズでルートページからヘッダーのログインボタンをクリックしてログインページに遷移するテスト', async ({ page }) => {
  // PCサイズ（幅1920px、高さ1080px）にウィンドウサイズを設定
  await page.setViewportSize({ width: 1920, height: 1080 });

  // ルートページを開く（トップページのURLを指定）
  await page.goto('http://localhost:8000'); // 実際のルートページのURLを指定

  // 最初のログインボタンが表示されるまで待機
  const loginButton = await page.getByText('ログイン').nth(1);
  await expect(loginButton).toBeVisible();

  // ログインボタンをクリック
  await loginButton.click();

  // ログインページに遷移したことを確認
  await expect(page).toHaveURL(/\/Login/);

  // Googleログインボタンが表示されていることを確認
  const googleLoginButton = await page.getByText('Custom Google Login');
  await expect(googleLoginButton).toBeVisible();

  // Googleログインボタンをクリック
  await googleLoginButton.click();
});
