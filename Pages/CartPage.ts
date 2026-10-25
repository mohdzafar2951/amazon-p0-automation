import { expect, Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartLink = page.locator('#nav-cart');
  }

  async open(): Promise<void> {
    await expect(this.cartLink).toBeVisible({ timeout: 15_000 });
    await this.cartLink.click();
    await expect(this.page).toHaveURL(/cart/i, { timeout: 20_000 });
    await this.page.waitForLoadState('domcontentloaded');
  }

  private item(asin: string): Locator {
    return this.page.locator(`[data-asin="${asin}"]`).first();
  }

  async verifyItemIsPresent(asin: string): Promise<void> {
    await expect(this.item(asin)).toBeVisible({ timeout: 20_000 });
  }

  async increaseQuantityToTwo(asin: string): Promise<void> {
    const item = this.item(asin);
    await expect(item).toBeVisible({ timeout: 20_000 });
    const stepper = item.locator('fieldset[data-action="a-stepper"]');
    await expect(stepper).toBeVisible({ timeout: 15_000 });
    const quantityValue = stepper.locator('[data-a-selector="inner-value"]');
    await expect(quantityValue).toHaveText('1');
    const incrementButton = stepper.locator('button[data-action="a-stepper-increment"]');
    await expect(incrementButton).toBeEnabled();
    await incrementButton.click();
    // Amazon does not reliably update its internal data-quantity attribute.
    await expect(quantityValue).toHaveText('2', { timeout: 20_000 });
  }

  async proceedToCheckout(): Promise<void> {
    const proceedButton = this.page.getByRole('button', { name: /proceed to buy/i })
      .or(this.page.getByRole('link', { name: /proceed to buy/i })).first();
    await expect(proceedButton).toBeVisible({ timeout: 15_000 });
    await proceedButton.click();
  }

  async verifySignInBoundary(): Promise<void> {
    await expect.poll(async () => {
      const hasSignInUrl = /\/ap\/signin(?:[/?]|$)/i.test(this.page.url());
      const hasHeading = await this.page.getByRole('heading', { name: /sign in/i }).first().isVisible().catch(() => false);
      const hasEmail = await this.page.locator('#ap_email, input[type="email"]').first().isVisible().catch(() => false);
      return hasSignInUrl || hasHeading || hasEmail;
    }, { timeout: 20_000, message: 'Amazon did not redirect to the safe sign-in boundary.' }).toBe(true);
  }
}
