# P0 smoke test cases

| ID | Title | Preconditions | Steps | Expected result | Automated |
| --- | --- | --- | --- | --- | --- |
| TC-01 | Search and verify product details | Amazon.in is reachable and results exist. | Search the configured keyword and open a visible product. | Product title, price, and availability are visible. | Yes |
| TC-02 | Add a product to the cart | A purchasable product is available. | Search, open a product, and add it to the cart. | Amazon confirms the item was added. | Yes |
| TC-03 | Verify cart contents | A purchasable product is available. | Add the selected product and open the cart. | The cart contains the selected product ASIN. | Yes |
| TC-04 | Update cart quantity | A purchasable product is available. | Add a product and increase its quantity. | Quantity changes from one to two. | Yes |
| TC-05 | Proceed toward checkout | A purchasable product is available. | Add a product and select **Proceed to Buy**. | Amazon reaches the sign-in boundary; no order or payment is attempted. | Yes |

These are P0 because they cover the minimum customer purchase path: discovery, product evaluation, cart creation and verification, cart modification, and the safe transition toward checkout.
