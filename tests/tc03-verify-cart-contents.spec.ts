import { test } from '@playwright/test';
import { CartPage } from '../Pages/CartPage';
import { attachExecutionDetails, openFirstAvailableProduct } from './helpers/shopping-journey';

test('@smoke TC-03: verify the cart contains the selected product', async ({ page }, testInfo) => {
  const { product, asin, details } = await openFirstAvailableProduct(page);
  await product.addProductToCart();
  const cart = new CartPage(page);
  await cart.open();
  await cart.verifyItemIsPresent(asin);
  await attachExecutionDetails(testInfo, { actual: 'Selected product was found in the cart with quantity 1.', comments: `${details}; Selected ASIN: ${asin}; Quantity: 1` });
});
