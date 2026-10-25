import { test } from '@playwright/test';
import { CartPage } from '../Pages/CartPage';
import { openFirstAvailableProduct } from './helpers/shopping-journey';

test('@smoke TC-05: proceed from cart to checkout', async ({ page }) => {
  const { product } = await openFirstAvailableProduct(page);
  await product.addProductToCart();
  const cart = new CartPage(page);
  await cart.open();
  await cart.proceedToCheckout();
  await cart.verifySignInBoundary();
});
