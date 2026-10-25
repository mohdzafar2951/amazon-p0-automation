import { test } from '@playwright/test';
import { CartPage } from '../Pages/CartPage';
import { attachExecutionDetails, openFirstAvailableProduct } from './helpers/shopping-journey';

test('@smoke TC-04: update cart quantity from 1 to 2', async ({ page }, testInfo) => {
  const { product, asin, details } = await openFirstAvailableProduct(page);
  await product.addProductToCart();
  const cart = new CartPage(page);
  await cart.open();
  await cart.increaseQuantityToTwo(asin);
  await attachExecutionDetails(testInfo, { actual: 'Selected product quantity successfully changed from 1 to 2.', comments: `${details}; Initial quantity: 1; Final quantity: 2` });
});
