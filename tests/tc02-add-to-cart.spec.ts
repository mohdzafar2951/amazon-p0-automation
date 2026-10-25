import { test } from '@playwright/test';
import { openFirstAvailableProduct } from './helpers/shopping-journey';

test('@smoke TC-02: add a product to the cart', async ({ page }) => {
  const { product } = await openFirstAvailableProduct(page);
  await product.addProductToCart();
  await product.verifyAddedToCart();
});
