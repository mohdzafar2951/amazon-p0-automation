import { test } from '@playwright/test';
import { CartPage } from '../Pages/CartPage';
import { openFirstAvailableProduct } from './helpers/shopping-journey';

test('@smoke TC-04: update cart quantity from 1 to 2', async ({ page }) => {
  const { product, asin } = await openFirstAvailableProduct(page);
  await product.addProductToCart();
  const cart = new CartPage(page);
  await cart.open();
  await cart.increaseQuantityToTwo(asin);
});
