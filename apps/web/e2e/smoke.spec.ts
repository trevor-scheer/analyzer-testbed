import { test, expect } from "@playwright/test";

test.describe("PokéForge happy path", () => {
  test("visits Pokédex, opens a detail page", async ({ page }) => {
    await page.goto("/pokedex");
    await expect(page.getByRole("heading", { name: "Pokédex" })).toBeVisible();

    // Wait for the client-side Apollo query to resolve and cards to appear
    const firstCard = page.locator("a[href^='/pokedex/']").first();
    await expect(firstCard).toBeVisible({ timeout: 15_000 });
    const href = await firstCard.getAttribute("href");
    await firstCard.click();

    // Detail page loaded
    await expect(page).toHaveURL(href!);
    // Stat bar present
    await expect(page.getByText("Base Stats")).toBeVisible({ timeout: 10_000 });
    // Deprecated captureRate card present
    await expect(page.getByText("Legacy Stat (Gen I)")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("navigates to teams list", async ({ page }) => {
    await page.goto("/sign-in");
    const nameInput = page.locator('input[id="name"]');
    // Wait for hydration so the controlled input is reactive
    await expect(nameInput).toBeVisible({ timeout: 10_000 });
    await nameInput.click();
    await nameInput.pressSequentially("TestTrainer", { delay: 30 });
    // Wait for button to become enabled (React state update)
    await expect(page.locator('button[type="submit"]')).not.toBeDisabled({ timeout: 5_000 });
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/teams", { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: "My Teams" })).toBeVisible();
  });

  test("visits create team page and sees Pokémon browse grid", async ({ page }) => {
    await page.goto("/sign-in");
    const nameInput = page.locator('input[id="name"]');
    await expect(nameInput).toBeVisible({ timeout: 10_000 });
    await nameInput.click();
    await nameInput.pressSequentially("TestTrainer", { delay: 30 });
    await expect(page.locator('button[type="submit"]')).not.toBeDisabled({ timeout: 5_000 });
    await page.click('button[type="submit"]');

    await page.goto("/teams/new");
    await expect(page.getByRole("heading", { name: "Create Team" })).toBeVisible({
      timeout: 10_000,
    });

    // Wait for Pokémon browse grid to load
    await expect(page.locator(".grid > button").first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test("visits battle start page", async ({ page }) => {
    await page.goto("/battle/new");
    // Battle page shows spinner while loading teams query, then renders heading
    await expect(page.getByRole("heading", { name: "Start Battle" })).toBeVisible({
      timeout: 15_000,
    });
    // Team select dropdowns are present
    await expect(page.getByLabel("Your Team")).toBeVisible();
    await expect(page.getByLabel("Opponent Team")).toBeVisible();
  });
});
