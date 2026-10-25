# Amazon.in P0 Smoke Test Cases

## Test case summary

All five P0 test cases are automated using Playwright with TypeScript. Each test establishes its own shopping journey and does not depend on another test running first.

**Configured environment**
- Base URL: `https://www.amazon.in`
- Search keyword: `wireless keyboard`
- Priority: P0 for all five cases

| ID | Test Case Title | Priority | Automated |
|---|---|---|---|
| TC-01 | Search for a product and verify product details | P0 | Yes |
| TC-02 | Add a product to the cart | P0 | Yes |
| TC-03 | Verify cart contents | P0 | Yes |
| TC-04 | Update cart quantity | P0 | Yes |
| TC-05 | Proceed from cart to checkout | P0 | Yes |

## Detailed test cases

### TC-01 — Search for a product and verify product details

**Business rationale:** Product discovery and accurate product information are essential for customers to make purchase decisions.

**Preconditions:** Amazon.in is reachable, and relevant search results are available.

**Test data:** Search keyword: `wireless keyboard`.

**Steps:**
1. Open Amazon.in.
2. Search for the configured keyword.
3. Verify that relevant search results appear.
4. Open a visible product from the results.
5. Verify the product title, price, and availability information where displayed.

**Expected result:** Search results appear, the selected product page opens, and the expected product information is displayed.

### TC-02 — Add a product to the cart

**Business rationale:** Adding an item to the cart is a core step in the purchase journey.

**Preconditions:** Amazon.in is reachable, and a purchasable product is available.

**Test data:** Configured search keyword and a visible available product.

**Steps:**
1. Search for a product.
2. Open its product details page.
3. Select Add to Cart.
4. Verify the cart confirmation or corresponding cart state.

**Expected result:** The selected product is added to the cart, and an appropriate confirmation or updated cart state is displayed.

### TC-03 — Verify cart contents

**Business rationale:** Customers need confidence that their cart contains the intended product before proceeding to checkout.

**Preconditions:** The test establishes its own cart state by adding a product.

**Test data:** Selected available product; expected quantity: 1.

**Steps:**
1. Search for and add a product to the cart.
2. Open the cart.
3. Verify the product identity.
4. Verify the expected quantity and displayed pricing information where applicable.

**Expected result:** The intended product appears in the cart with the expected quantity and consistent displayed pricing information.

### TC-04 — Update cart quantity

**Business rationale:** Incorrect quantity updates can lead to unexpected costs and customer frustration.

**Preconditions:** The test adds its own product to the cart, and the item supports quantity changes.

**Test data:** Selected available product; change quantity from 1 to 2, subject to availability.

**Steps:**
1. Add the product to the cart.
2. Open the cart.
3. Change the quantity to 2.
4. Verify the updated quantity and displayed subtotal where applicable.

**Expected result:** The cart reflects the requested quantity, and related displayed values update consistently.

### TC-05 — Proceed from cart to checkout

**Business rationale:** Checkout is a critical stage in the purchase journey.

**Preconditions:** The test establishes its own cart state by adding a purchasable product.

**Test data:** Selected available product in the cart.

**Steps:**
1. Add a product to the cart.
2. Open the cart and verify the selected product.
3. Select Proceed to Buy.
4. Verify the resulting page and identify any sign-in or verification requirement.

**Expected result:** The journey reaches the appropriate next checkout step or displays a sign-in requirement. The test stops before placing an order, submitting payment, creating an account, or attempting to bypass CAPTCHA or verification.

## Execution evidence

Actual results, pass/fail status, comments, screenshots, and error details are recorded in the generated Excel execution report. Live-site tests may fail or stop when Amazon presents CAPTCHA or verification challenges; these are reported rather than bypassed.

## Why these cases are P0

These cases cover the minimum revenue-critical shopping path: product discovery, product evaluation, cart creation, cart verification, quantity modification, and the safe transition toward checkout.
