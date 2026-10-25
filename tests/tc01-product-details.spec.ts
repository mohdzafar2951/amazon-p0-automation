import { test } from '@playwright/test';
import { openFirstAvailableProduct } from './helpers/shopping-journey';

test('@smoke TC-01: search for a product and verify product details', async ({ page }) => {
  const { product } = await openFirstAvailableProduct(page);
  await product.verifyCoreDetails();
});
