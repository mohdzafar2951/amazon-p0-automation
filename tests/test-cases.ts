export type TestCaseDefinition = {
  id: string;
  title: string;
  priority: 'P0';
  rationale: string;
  preconditions: string;
  steps: string;
  expectedResult: string;
};

export const testCases: TestCaseDefinition[] = [
  { id: 'TC-01', title: 'Search for a product, select a product and verify product details', priority: 'P0', rationale: 'Product discovery and accurate product information are essential for customers to make purchase decisions.', preconditions: 'Amazon.in is reachable, and a relevant product is available.', steps: '1. Open Amazon.in.\n2. Search for the product.\n3. Verify relevant search results.\n4. Open a product.\n5. Verify its title, price, and availability information.', expectedResult: 'Relevant search results appear, a product can be selected, the product page opens, and expected product information is displayed.' },
  { id: 'TC-02', title: 'Add a product to the cart', priority: 'P0', rationale: 'Adding an item to the cart is a core step in the purchase journey.', preconditions: 'Amazon.in is reachable, and a purchasable product is available.', steps: '1. Search for a product.\n2. Open its product details page.\n3. Click Add to Cart.\n4. Verify the cart confirmation.', expectedResult: 'The selected product is added to the cart, and an appropriate confirmation is displayed.' },
  { id: 'TC-03', title: 'Verify cart contents', priority: 'P0', rationale: 'Customers need confidence that their cart contains the intended product before checkout.', preconditions: 'The test establishes its own cart state by adding a product.', steps: '1. Search for and add the product.\n2. Open the cart.\n3. Verify the selected product identity.', expectedResult: 'The intended product appears in the cart with quantity 1.' },
  { id: 'TC-04', title: 'Update cart quantity from 1 to 2', priority: 'P0', rationale: 'Customers need to update the quantity of an item in their cart before checkout.', preconditions: 'The test establishes its own cart state by adding a product.', steps: '1. Search for and select a product.\n2. Add it to the cart.\n3. Verify initial quantity 1.\n4. Increase the quantity to 2.\n5. Verify displayed quantity 2.', expectedResult: 'The selected product quantity changes from 1 to 2 and the cart displays the updated quantity.' },
  { id: 'TC-05', title: 'Proceed from cart to checkout', priority: 'P0', rationale: 'Checkout is a critical stage in the purchase journey; a blocker can prevent customers from completing purchases.', preconditions: 'The test establishes its own cart state by adding a purchasable product. The browser should be signed out.', steps: '1. Search for and select a product.\n2. Add it to the cart and open the cart.\n3. Select Proceed to Buy.\n4. Verify the sign-in requirement.\n5. Stop before placing an order or submitting payment.', expectedResult: 'The checkout journey advances to a sign-in requirement. No order or payment is submitted.' },
];
