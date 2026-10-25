
import { expect, Locator, Page } from '@playwright/test';

export class AmazonHomePage {
  readonly page: Page;
  readonly searchBox: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.searchBox = page.getByRole('searchbox', {
      name: 'Search Amazon.in',
    });

    this.searchButton = page.locator('#nav-search-submit-button');
  }

  async open(): Promise<void> {
    await this.page.goto('/', {
      waitUntil: 'domcontentloaded',
    });
  }

  async searchFor(keyword: string): Promise<void> {
    await expect(this.searchBox).toBeVisible({ timeout: 15000 });
    await this.searchBox.fill(keyword);
    await this.searchButton.click();
    await expect(this.page.locator('[data-component-type="s-search-result"]').first())
      .toBeVisible({ timeout: 20_000 });
  }

  async isChallengePage(): Promise<boolean> {
    const challengeSelectors = [
      'form[action*="validateCaptcha"]',
      '#captchacharacters',
      'input[name="captchacharacters"]',
    ];

    for (const selector of challengeSelectors) {
      if (await this.page.locator(selector).count() > 0) {
        return true;
      }
    }

    const bodyText = await this.page
      .locator('body')
      .innerText()
      .catch(() => '');

    return /enter the characters you see below|type the characters you see in this image|robot check/i.test(
      bodyText,
    );
  }

  async ensureNoChallenge(location: string): Promise<void> {
    if (await this.isChallengePage()) {
      throw new Error(`Amazon displayed a CAPTCHA or verification challenge at ${location}.`);
    }
  }

  async getFirstProductLink(): Promise<Locator> {
    const selectors = [
      '[data-component-type="s-search-result"] h2 a',
      '[data-component-type="s-search-result"] a[href*="/dp/"]',
      'h2 a[href*="/dp/"]',
      'a[href*="/dp/"]',
    ];

    for (const selector of selectors) {
      const links = this.page.locator(selector);
      const count = await links.count();

      for (let i = 0; i < count; i++) {
        const link = links.nth(i);
        const href = await link.getAttribute('href').catch(() => null);
        const visible = await link.isVisible().catch(() => false);

        if (href?.includes('/dp/') && visible) {
          return link;
        }
      }
    }

    throw new Error(
      `No visible product link was found. URL: ${this.page.url()}. ` +
      `Page title: ${await this.page.title()}`,
    );
  }
}
