
import { expect, Locator, Page } from '@playwright/test';
import { Buffer } from 'node:buffer';

export class ProductPage {
  readonly page: Page;
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly availability: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Use the visible product title, not Amazon's hidden input.
    this.productTitle = page.locator('span#productTitle');

    this.productPrice = page.locator(
      '#corePriceDisplay_desktop_feature_div .a-price .a-offscreen, ' +
      '#corePrice_feature_div .a-price .a-offscreen, ' +
      '#apex_desktop .a-price .a-offscreen',
    ).first();

    this.availability = page.locator('#availability').first();

    this.addToCartButton = page.locator(
      '#add-to-cart-button',
    );
  }

  async verifyProductPage(): Promise<void> {
    await expect(this.productTitle).toBeVisible({
      timeout: 20000,
    });
  }

  async verifyCoreDetails(): Promise<void> {
    await this.verifyProductPage();
    await expect(this.productPrice).toBeVisible({ timeout: 20_000 });
    await expect(this.availability).toBeVisible({ timeout: 20_000 });
  }

  async verifyAddedToCart(): Promise<void> {
    await expect(this.page.getByText(/added to cart/i).first()).toBeVisible({ timeout: 15_000 });
  }

  async getProductTitle(): Promise<string> {
    return (await this.productTitle.innerText()).trim();
  }

  async getProductPrice(): Promise<string> {
    if (await this.productPrice.count() === 0) {
      return 'Price not displayed';
    }

    const price = (
      await this.productPrice.innerText().catch(() => '')
    ).trim();

    return price || 'Price not displayed';
  }

  async getAvailability(): Promise<string> {
    if (await this.availability.count() === 0) {
      return 'Availability information not displayed';
    }

    const text = (
      await this.availability.innerText().catch(() => '')
    ).trim();

    return text || 'Availability information not displayed';
  }

  async addProductToCart(): Promise<void> {
    await this.verifyProductPage();

    await expect(this.addToCartButton).toBeVisible({
      timeout: 15000,
    });

    await expect(this.addToCartButton).toBeEnabled({
      timeout: 15000,
    });

    await this.addToCartButton.click();
  }

  async getAsin(): Promise<string> {
    const asinFromUrl = this.page.url().match(/\/dp\/([A-Z0-9]{10})(?:[/?]|$)/i)?.[1];
    const asinFromInput = await this.page.locator('#ASIN').inputValue().catch(() => '');
    const asin = asinFromInput || asinFromUrl || '';

    expect(asin, 'Could not identify the selected product.').toMatch(/^[A-Z0-9]{10}$/i);
    return asin;
  }

  async captureProductScreenshot(): Promise<Buffer> {
    await this.verifyProductPage();

    return this.page.screenshot({
      fullPage: true,
      animations: 'disabled',
    });
  }
}
