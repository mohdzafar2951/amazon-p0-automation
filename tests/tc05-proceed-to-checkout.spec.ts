import { test } from '@playwright/test';
import { CartPage } from '../Pages/CartPage';
import { attachExecutionDetails, openFirstAvailableProduct } from './helpers/shopping-journey';

test('@smoke TC-05: proceed from cart to checkout', async ({ page }, testInfo) => {
  const { product, details } = await openFirstAvailableProduct(page);
  await product.addProductToCart();
  const cart = new CartPage(page);
  await cart.open();
  await cart.proceedToCheckout();
  await cart.verifySignInBoundary();
  await attachExecutionDetails(testInfo, { actual: 'Amazon displayed the sign-in requirement. The test stopped before placing an order or payment.', comments: `${details}; Checkout outcome: sign-in requirement displayed` });
});
