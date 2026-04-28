import { test, expect } from "@playwright/test";

test.describe("PokéForge happy path", () => {
  test("visits Pokédex, opens a detail page", async ({ page }) => {
    await page.goto("/pokedex");
    await expect(page.getByRole("heading", { name: "Pokédex" })).toBeVisible();

    // Click the first Pokémon card link
    const firstCard = page.locator("a[href^='/pokedex/']").first();
    await expect(firstCard).toBeVisible();
    const href = await firstCard.getAttribute("href");
    await firstCard.click();

    // Detail page loaded
    await expect(page).toHaveURL(href!);
    // Stat bar present
    await expect(page.getByText("Base Stats")).toBeVisible();
    // Deprecated captureRate card present
    await expect(page.getByText("Legacy Stat (Gen I)")).toBeVisible();
  });

  test("navigates to teams list", async ({ page }) => {
    // Sign in first
    await page.goto("/sign-in");
    await page.fill('input[id="name"]', "TestTrainer");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/teams");
    await expect(page.getByRole("heading", { name: "My Teams" })).toBeVisible();
  });

  test("visits create team page and sees Pokémon browse grid", async ({ page }) => {
    await page.goto("/sign-in");
    await page.fill('input[id="name"]', "TestTrainer");
    await page.click('button[type="submit"]');

    await page.goto("/teams/new");
    await expect(page.getByRole("heading", { name: "Create Team" })).toBeVisible();

    // Wait for Pokémon browse grid to load
    await expect(page.locator(".grid > button").first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test("visits battle start page", async ({ page }) => {
    await page.goto("/battle/new");
    await expect(page.getByRole("heading", { name: "Start Battle" })).toBeVisible();
    // Team select dropdowns are present
    await expect(page.getByLabel("Your Team")).toBeVisible();
    await expect(page.getByLabel("Opponent Team")).toBeVisible();
  });
});
