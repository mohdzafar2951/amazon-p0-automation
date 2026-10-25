import { test } from '@playwright/test';
import { CartPage } from '../Pages/CartPage';
import { openFirstAvailableProduct } from './helpers/shopping-journey';

test('@smoke TC-03: verify the cart contains the selected product', async ({ page }) => {
  const { product, asin } = await openFirstAvailableProduct(page);
  await product.addProductToCart();
  const cart = new CartPage(page);
  await cart.open();
  await cart.verifyItemIsPresent(asin);
});
