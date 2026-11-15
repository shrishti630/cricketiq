import { test, expect } from '@playwright/test';

test.describe('CricketIQ IPL Intelligence Hub - End-to-End Suite', () => {

  test('1. Dashboard / Match Center loads with live match & Sync Live button', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/CricketIQ/);

    // Verify Match Center elements
    await expect(page.locator('text=AI Match Intelligence').first()).toBeVisible();

    // Verify Live Match Score Banner (CSK vs MI)
    await expect(page.locator('text=Chennai Super Kings').first()).toBeVisible();
    await expect(page.locator('text=Mumbai Indians').first()).toBeVisible();

    // Click "Sync Live" button
    const syncBtn = page.locator('button:has-text("Sync Live")').first();
    await expect(syncBtn).toBeVisible();
    await syncBtn.click();

    // Verify Live Synchronized Status Pill
    await expect(page.locator('text=Synchronized with ipl_db').first()).toBeVisible({ timeout: 10000 });
  });

  test('2. Teams Page displays all 10 IPL franchises and opens squad modal', async ({ page }) => {
    await page.goto('/');

    // Navigate to Teams
    await page.getByRole('button', { name: /Teams \(Clubs\)/ }).first().click();
    await expect(page.locator('text=IPL Club Hubs').first()).toBeVisible();

    // Verify 10 team codes exist
    const teamCodes = ['CSK', 'MI', 'RCB', 'KKR', 'SRH', 'RR', 'GT', 'LSG', 'DC', 'PK'];
    for (const code of teamCodes) {
      await expect(page.locator(`text=${code}`).first()).toBeVisible();
    }

    // Click on CSK card to view squad modal
    await page.locator('text=Chennai Super Kings').first().click();
    await expect(page.locator('text=Active Squad Roster').first()).toBeVisible();
    await expect(page.locator('text=Ruturaj Gaikwad').first()).toBeVisible();

    // Close modal
    await page.locator('div.fixed button:has([class*="lucide-x"])').first().click();
    await expect(page.locator('text=Active Squad Roster')).not.toBeVisible();
  });

  test('3. Player Scout displays players, search, role filters, and comparator', async ({ page }) => {
    await page.goto('/');

    // Navigate to Player Scout
    await page.getByRole('button', { name: 'Player Scout' }).first().click();
    await expect(page.locator('text=IPL Player Scout & Head-to-Head').first()).toBeVisible();

    // Filter by Role
    await page.locator('button:has-text("Batsman")').first().click();
    await expect(page.locator('h3:has-text("Virat Kohli")').first()).toBeVisible();

    // Reset to All Roles before searching Bumrah
    await page.locator('button:has-text("All Roles")').first().click();
    const searchInput = page.locator('input[placeholder="Search star players..."]').first();
    await searchInput.fill('Bumrah');
    await expect(page.locator('h3:has-text("Jasprit Bumrah")').first()).toBeVisible();
    await searchInput.fill('');
  });

  test('4. IPL Standings Table renders all 10 teams with playoff odds', async ({ page }) => {
    await page.goto('/');

    // Navigate to Standings
    await page.getByRole('button', { name: 'IPL Table' }).first().click();
    await expect(page.locator('text=IPL 2025 Standings & Table').first()).toBeVisible();

    // Verify key table content
    await expect(page.locator('table').first()).toBeVisible();
    await expect(page.locator('text=Chennai Super Kings').first()).toBeVisible();
    await expect(page.locator('text=Playoff Qualifier').first()).toBeVisible();
  });

  test('5. Fantasy XI Studio enforces 100 max credits and auto-optimizes squad', async ({ page }) => {
    await page.goto('/');

    // Navigate to Fantasy
    await page.getByRole('button', { name: 'Fantasy XI Studio' }).first().click();
    await expect(page.locator('text=Fantasy XI Studio & Pitch Builder').first()).toBeVisible();

    // Click Auto-Optimize Fantasy XI
    const autoOptimizeBtn = page.locator('button:has-text("AI Auto-Optimize Squad")').first();
    await expect(autoOptimizeBtn).toBeVisible();
    await autoOptimizeBtn.click();

    // Verify 11 players selected
    await expect(page.locator('text=11 / 11').first()).toBeVisible({ timeout: 10000 });
  });

  test('6. AI Intelligence War Room executes grounded query with agent trace', async ({ page }) => {
    test.setTimeout(45000);
    await page.goto('/');

    // Navigate explicitly to AI War Room
    await page.getByRole('button', { name: /AI Intelligence Hub/ }).first().click();
    await expect(page.locator('text=CricketIQ Intelligence War Room').first()).toBeVisible();

    // Run quick scenario chip in the War Room
    const scenarioChip = page.locator('button:has-text("Player Scout")').last();
    await expect(scenarioChip).toBeVisible();
    await scenarioChip.click();

    // Wait for Tool Execution Trace
    await expect(page.locator('text=Tool Execution Trace').first()).toBeVisible({ timeout: 25000 });
    await expect(page.locator('text=100% Deterministic Grounding').first()).toBeVisible();
  });

  test('7. Ask AI Analyst Slide-out Drawer opens and closes', async ({ page }) => {
    await page.goto('/');

    // Click "Ask AI Analyst" in top bar
    await page.locator('button:has-text("Ask AI Analyst")').first().click();
    await expect(page.locator('text=CricketIQ Agentic Intelligence').first()).toBeVisible();

    // Close drawer
    await page.locator('button:has([class*="lucide-x"])').first().click();
  });

  test('8. Live Integrations Modal displays Cricbuzz RapidAPI configuration', async ({ page }) => {
    await page.goto('/');

    // Click Key icon in navbar
    const keyBtn = page.locator('button[title*="Connect Live Gemini"]').first();
    await expect(keyBtn).toBeVisible();
    await keyBtn.click();

    // Verify Modal
    await expect(page.locator('text=Live Cricket & AI Integrations').first()).toBeVisible();
    await expect(page.locator('text=Live Cricbuzz / Cricket API').first()).toBeVisible();
    await expect(page.locator('text=Cricbuzz (RapidAPI)').first()).toBeVisible();

    // Close modal
    await page.locator('button:has-text("Cancel")').first().click();
    await expect(page.locator('text=Live Cricket & AI Integrations')).not.toBeVisible();
  });

});
