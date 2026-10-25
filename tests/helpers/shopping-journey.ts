import { Page } from '@playwright/test';

import { AmazonHomePage } from '../../Pages/AmazonHomePage';
import { ProductPage } from '../../Pages/ProductPage';
import testData from '../../Config/test-data.json';

export async function openFirstAvailableProduct(page: Page, keyword = testData.searchKeyword): Promise<{ home: AmazonHomePage; product: ProductPage; asin: string }> {
  const home = new AmazonHomePage(page);
  const product = new ProductPage(page);
  await home.open();
  await home.ensureNoChallenge('the Amazon home page');
  await home.searchFor(keyword);
  await home.ensureNoChallenge('the search results page');
  const productLink = await home.getFirstProductLink();
  const href = await productLink.getAttribute('href');
  if (!href) throw new Error('The selected search result has no product URL.');
  await page.goto(new URL(href, page.url()).toString(), { waitUntil: 'domcontentloaded' });
  await home.ensureNoChallenge('the product details page');
  await product.verifyProductPage();
  if (/currently unavailable|out of stock/i.test(await product.getAvailability())) throw new Error('The selected product is unavailable.');
  return { home, product, asin: await product.getAsin() };
}
