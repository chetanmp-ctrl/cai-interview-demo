// tests/e2e/productionOrder.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { ProductsPage } = require('../../pages/ProductsPage');
const { testUsers, productData } = require('../data/testData');

test.describe('Product Order Workflow - SauceDemo', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(
      testUsers.admin.username,
      testUsers.admin.password
    );
    await expect(page).toHaveURL(
      'https://www.saucedemo.com/inventory.html'
    );
  });

  test('Add product to cart and verify count',
    async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.addProductToCart();
    const cartCount = await productsPage.getCartCount();
    expect(cartCount).toBe('1');
  });

  test('Add multiple products to cart',
    async ({ page }) => {
    const productsPage = new ProductsPage(page);

    // Add first product
    await page.locator(
      '[data-test="add-to-cart-sauce-labs-backpack"]'
    ).click();

    // Add second product
    await page.locator(
      '[data-test="add-to-cart-sauce-labs-bike-light"]'
    ).click();

    const cartCount = await productsPage.getCartCount();
    expect(cartCount).toBe('2');
  });

  test('Navigate to cart after adding product',
    async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.addProductToCart();
    await productsPage.cartIcon.click();
    await expect(page).toHaveURL(
      'https://www.saucedemo.com/cart.html'
    );
  });

  test('Product details page loads correctly',
    async ({ page }) => {
    await page.locator('.inventory_item_name')
      .first().click();
    await expect(page).toHaveURL(
      /inventory-item/
    );
    await expect(
      page.locator('.inventory_details_name')
    ).toBeVisible();
  });
});