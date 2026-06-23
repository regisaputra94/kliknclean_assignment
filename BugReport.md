# Bug Report — Sauce Demo Exploratory Testing

**Tester:** Regi Saputra
**Application:** https://www.saucedemo.com

---

# Defect 1 — Unable to Remove Items from Cart (`problem_user`)

**Severity:** High
**Component:** Cart Management

### Description

Some products can be added to the cart but cannot be removed successfully when logged in as `problem_user`.

### Steps to Reproduce

1. Login as `problem_user`.
2. Add a product (e.g., Sauce Labs Backpack).
3. Click **Remove**.

### Expected Result

The item is removed from the cart and the cart badge count is updated.

### Actual Result

The item remains in the cart and/or the cart badge count does not update correctly.

### Impact

Users cannot manage cart contents correctly, affecting a core e-commerce function.

### Recommendation

Add automated validation for both add-to-cart and remove-from-cart actions, including cart badge verification.

---

# Defect 2 — Checkout Validation Can Be Bypassed (`error_user`)

**Severity:** High
**Component:** Checkout

### Description

`error_user` can proceed through checkout with invalid customer information but is unable to complete the order later in the flow.

### Steps to Reproduce

1. Login as `error_user`.
2. Add a product to the cart.
3. Proceed to checkout.
4. Leave required customer information incomplete.
5. Continue to the next step and attempt to finish the order.

### Expected Result

Validation should prevent progression until all required fields are completed.

### Actual Result

The user can continue to the overview page but cannot complete the order.

### Impact

Creates a broken checkout experience and could lead to abandoned purchases in a real application.

### Recommendation

Enforce validation before allowing users to proceed and provide clear error messages when validation fails.

---

# Defect 3 — Incorrect Product Image After Sorting (`visual_user`)

**Severity:** Medium
**Component:** Product Catalog

### Description

After applying a sort option, the first product sometimes displays an incorrect image when logged in as `visual_user`.

### Steps to Reproduce

1. Login as `visual_user`.
2. Apply any product sorting option.
3. Observe the first product image.

### Expected Result

Each product should display its correct image regardless of sorting.

### Actual Result

The first product displays an incorrect or mismatched image.

### Impact

May reduce user trust and create confusion about product selection.

### Recommendation

Add automated checks to verify product image consistency before and after sorting operations.

---

# Defect 4 — Checkout Can Be Completed Without Any Products in Cart

**Severity:** High
**Component:** Checkout Flow

### Description

A user is able to access and complete the checkout process even when the cart contains no products.

### Steps to Reproduce

1. Login as a valid user (e.g., `standard_user`).
2. Ensure the shopping cart is empty.
3. Navigate directly to the checkout flow (or continue checkout after removing all items from the cart).
4. Complete the customer information form.
5. Proceed through the checkout steps and finish the order.

### Expected Result

The system should prevent checkout when the cart is empty and display an appropriate message such as "Your cart is empty."

### Actual Result

The checkout process can be completed successfully despite having no items in the cart.

### Impact

This allows users to create invalid orders and indicates missing business-rule validation in the checkout process. In a real e-commerce application, this could lead to inaccurate order records and reporting issues.

### Recommendation

Implement validation to ensure at least one product exists in the cart before allowing users to proceed with checkout. Add an automated regression test to verify that checkout cannot be completed with an empty cart.

---

# Defect 5 — No Password Visibility Toggle on Login Form

**Severity:** Low
**Component:** Authentication / Login

### Description

The login form does not provide a password visibility toggle (show/hide password), making it difficult for users to verify their input when entering credentials.

### Steps to Reproduce

1. Navigate to the login page.
2. Enter a password in the password field.
3. Observe the available controls around the password input.

### Expected Result

Users should have the option to toggle password visibility to verify their input before submitting the form.

### Actual Result

The password field remains masked at all times, with no option to reveal the entered password.

### Impact

Users who mistype their password may experience unnecessary login failures and frustration, particularly on mobile devices or when using complex passwords.

### Recommendation

Add a show/hide password toggle icon to improve usability and reduce login errors caused by mistyped passwords.

---

# Defect Summary

| ID | Defect                                                | Severity | Status |
| -- | ----------------------------------------------------- | -------- | ------ |
| 1  | Unable to remove items from cart (`problem_user`)     | High     | Open   |
| 2  | Checkout validation can be bypassed (`error_user`)    | High     | Open   |
| 3  | Incorrect product image after sorting (`visual_user`) | Medium   | Open   |
| 4  | Checkout can be completed without products in cart | High   | Open   |
| 5  | No password visibility toggle on login form | Low   | Open   |
