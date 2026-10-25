import { Page, TestInfo } from '@playwright/test';

import { AmazonHomePage } from '../../Pages/AmazonHomePage';
import { ProductPage } from '../../Pages/ProductPage';
import testData from '../../Config/test-data.json';

export type ExecutionDetails = { actual: string; comments: string };

export async function attachExecutionDetails(testInfo: TestInfo, details: ExecutionDetails): Promise<void> {
  await testInfo.attach('execution-details', {
    body: Buffer.from(JSON.stringify(details)),
    contentType: 'application/json',
  });
}

export async function openFirstAvailableProduct(page: Page, keyword = testData.searchKeyword): Promise<{ home: AmazonHomePage; product: ProductPage; asin: string; details: string }> {
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
  const title = await product.getProductTitle();
  const price = await product.getProductPrice();
  const availability = await product.getAvailability();
  return { home, product, asin: await product.getAsin(), details: `Search phrase: ${keyword}; Product title: ${title}; Price: ${price}; Availability: ${availability}` };
}
