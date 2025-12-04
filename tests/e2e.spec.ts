import { test, expect } from '@playwright/test';

test('homepage renders core sections and takes screenshot', async ({ page }) => {
  // Root should bootstrap the built app (manifest or fallback) and render About/Projects
  await page.goto('/');

  // Wait for main title and a couple of sections to ensure hydration
  await expect(page.getByRole('heading', { name: 'About Me' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
  await expect(page.getByText('Latest Updates')).toBeVisible();

  // Card presence: ensure at least one project card renders
  const cards = page.locator('[aria-label="Project"] , [data-testid="project-card"] , .group.relative.cursor-pointer');
  await expect(cards.first()).toBeVisible();

  // Capture screenshot for visual sanity check
  await page.screenshot({ path: 'test-results/home.png', fullPage: true });
});
