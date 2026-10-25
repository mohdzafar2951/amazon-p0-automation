import { test } from '@playwright/test';
import { attachExecutionDetails, openFirstAvailableProduct } from './helpers/shopping-journey';

test('@smoke TC-02: add a product to the cart', async ({ page }, testInfo) => {
  const { product, details } = await openFirstAvailableProduct(page);
  await product.addProductToCart();
  await product.verifyAddedToCart();
  await attachExecutionDetails(testInfo, { actual: 'Product was added to the cart and Amazon displayed a confirmation.', comments: `${details}; Cart confirmation: displayed` });
});
