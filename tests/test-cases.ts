export type TestCaseDefinition = { id: string; title: string; priority: 'P0'; preconditions: string; steps: string; expectedResult: string };

export const testCases: TestCaseDefinition[] = [
  { id: 'TC-01', title: 'Search for a product and verify product details', priority: 'P0', preconditions: 'Amazon.in is reachable and search results are available.', steps: 'Open Amazon, search for the configured keyword, open a visible product result, and inspect its details.', expectedResult: 'A product page opens with a title, price, and availability information.' },
  { id: 'TC-02', title: 'Add a product to the cart', priority: 'P0', preconditions: 'A purchasable product is available for the configured keyword.', steps: 'Search, open a product, and add it to the cart.', expectedResult: 'Amazon confirms that the product was added.' },
  { id: 'TC-03', title: 'Verify the cart contains the selected product', priority: 'P0', preconditions: 'A purchasable product is available for the configured keyword.', steps: 'Search, open a product, add it to the cart, and open the cart.', expectedResult: 'The cart contains the selected product ASIN.' },
  { id: 'TC-04', title: 'Update cart quantity from 1 to 2', priority: 'P0', preconditions: 'A purchasable product is available for the configured keyword.', steps: 'Add a product to the cart and increase its quantity.', expectedResult: 'The selected cart item quantity updates from 1 to 2.' },
  { id: 'TC-05', title: 'Proceed from cart to checkout', priority: 'P0', preconditions: 'A purchasable product is available for the configured keyword.', steps: 'Add a product to the cart and select Proceed to Buy.', expectedResult: 'Amazon reaches the sign-in boundary; no order or payment is attempted.' },
];
