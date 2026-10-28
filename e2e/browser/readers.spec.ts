import { test as base, expect, type Page } from "@playwright/test";

const test = base.extend<{ runtimeCheck: void }>({
  runtimeCheck: [async ({ page }, use) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await use();
    expect(errors, "The reader should not encounter a client-side exception").toEqual([]);
  }, { auto: true }],
});

async function expectDeliveredImages(page: Page) {
  const images = page.locator("main img");
  expect(await images.count()).toBeGreaterThan(0);
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toBeVisible();
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
  }
}

async function expectNoHorizontalOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    await page.evaluate(() => window.innerWidth),
  );
}

test("archive search, collections, and reset help readers find a story", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Primary", exact: true }).getByRole("link", { name: "The stories", exact: true }).click();
  const archive = page.getByRole("region", { name: "Story archive" });
  await expect(archive).toBeInViewport();
  const cards = archive.getByRole("article");
  const total = await cards.count();
  expect(total).toBeGreaterThan(3);

  await archive.getByRole("searchbox", { name: "Search stories" }).fill("Poyais");
  await expect(cards).toHaveCount(1);
  await expect(cards.getByRole("heading", { level: 3 }).getByRole("link")).toHaveAttribute("href", "/stories/poyais-invented-country");
  await archive.getByRole("searchbox", { name: "Search stories" }).fill("");

  for (const [label, path] of [
    ["Strange schemes", "/stories/poyais-invented-country"],
    ["Close calls", "/stories/pig-war-san-juan"],
    ["Into the unknown", "/stories/bering-island-winter"],
  ]) {
    const filter = archive.getByRole("button", { name: label, exact: true });
    await filter.click();
    await expect(filter).toHaveAttribute("aria-pressed", "true");
    await expect(cards.locator(`a[href="${path}"]`).last()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(0);
    expect(await cards.count()).toBeLessThan(total);
  }

  await archive.getByRole("searchbox", { name: "Search stories" }).fill("no-such-archive-story");
  await expect(cards).toHaveCount(0);
  await expect(archive.getByRole("status")).toContainText("0 stories");
  await archive.getByRole("button", { name: /Reset filters/ }).click();
  await expect(cards).toHaveCount(total);
  await expect(archive.getByRole("searchbox", { name: "Search stories" })).toHaveValue("");
  await expect(archive.getByRole("button", { name: "All stories", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expectNoHorizontalOverflow(page);
});

test("a reader opens the cover, copies its canonical link, and continues to another story", async ({ page, context, isMobile }, testInfo) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.getByRole("region", { name: "Featured stories" }).getByRole("link", { name: "Read the Caroline affair", exact: true }).click();
  await expect(page).toHaveURL(/\/stories\/caroline-affair$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByText("On sources.", { exact: true })).toBeVisible();
  await expectDeliveredImages(page);
  await expectNoHorizontalOverflow(page);

  if (isMobile) {
    await page.locator("summary").filter({ hasText: "In this story" }).click();
    const contents = page.getByRole("navigation", { name: "Story sections", exact: true });
    await expect(contents).toBeVisible();
    const section = contents.getByRole("link").first();
    const fragment = await section.getAttribute("href");
    expect(fragment).toMatch(/^#section-/);
    await section.click();
    await expect(page).toHaveURL(new RegExp(`${fragment}$`));
    await expect(page.locator(fragment!)).toBeInViewport();
  }

  await page.getByRole("button", { name: "Copy link", exact: true }).first().click();
  await expect(page.getByRole("status").filter({ hasText: "Link copied" })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("https://almostlore.com/stories/caroline-affair");

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath("story.png"), fullPage: true });
  const next = page.getByRole("navigation", { name: "More stories", exact: true }).getByRole("article").getByRole("heading", { level: 3 }).getByRole("link").first();
  const title = await next.innerText();
  const href = await next.getAttribute("href");
  expect(href).not.toBe("/stories/caroline-affair");
  await next.click();
  await expect(page).toHaveURL(new RegExp(`${href}$`));
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
});

test("archival images load on the collection and an illustrated essay", async ({ page }, testInfo) => {
  await page.goto("/");
  await expectDeliveredImages(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath("homepage.png"), fullPage: true });

  const archive = page.getByRole("region", { name: "Story archive" });
  await archive.getByRole("searchbox", { name: "Search stories" }).fill("Poyais");
  await archive.getByRole("article").getByRole("heading", { level: 3 }).getByRole("link").click();
  await expect(page).toHaveURL(/\/stories\/poyais-invented-country$/);
  await expectDeliveredImages(page);
  expect(await page.locator("main figure").count()).toBeGreaterThan(1);
  await expectNoHorizontalOverflow(page);
});

test("primary navigation stays usable and pages fit the viewport", async ({ page }) => {
  await page.goto("/");
  const primary = page.getByRole("navigation", { name: "Primary", exact: true });
  await expectNoHorizontalOverflow(page);
  for (const link of await primary.getByRole("link", { includeHidden: true }).all()) {
    await expect(link).toBeVisible();
    const box = await link.boundingBox();
    expect(box?.width).toBeGreaterThan(0);
  }

  await primary.getByRole("link", { name: "Our approach", exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.getByRole("link", { name: "Almost Lore home", exact: true }).click();
  await expect(page).toHaveURL("http://127.0.0.1:4322/");
  await primary.getByRole("link", { name: "Get in touch", exact: true }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});
