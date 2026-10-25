import { test } from '@playwright/test';
import { attachExecutionDetails, openFirstAvailableProduct } from './helpers/shopping-journey';

test('@smoke TC-01: search for a product and verify product details', async ({ page }, testInfo) => {
  const { product, details } = await openFirstAvailableProduct(page);
  await product.verifyCoreDetails();
  await attachExecutionDetails(testInfo, { actual: 'Product page opened and product details were visible.', comments: details });
});
