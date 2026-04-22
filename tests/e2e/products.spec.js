// tests/e2e/products.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { ProductsPage } = require('../../pages/ProductsPage');
const { testUsers } = require('../data/testData');

test.describe('Products Module — SauceDemo', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(
      testUsers.admin.username,
      testUsers.admin.password
    );
    // Wait for inventory page to fully load
    await page.waitForURL(
      'https://www.saucedemo.com/inventory.html'
    );
    await page.waitForLoadState('networkidle');
  });

  test('Products page displays 6 products',
    async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const count = await productsPage.getProductCount();
    expect(count).toBe(6);
  });

  test('Add product to cart updates cart count',
    async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.addProductToCart();
    const cartCount = await productsPage.getCartCount();
    expect(cartCount).toBe('1');
  });

  test('Sort products by name A to Z',
    async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await page.waitForSelector(
      'select.product_sort_container'
    );
    await productsPage.sortProducts('az');
    const firstName =
      await productsPage.getFirstProductName();
    expect(firstName).toBe('Sauce Labs Backpack');
  });

  test('Sort products by price low to high',
    async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await page.waitForSelector(
      'select.product_sort_container'
    );
    await productsPage.sortProducts('lohi');
    const firstName =
      await productsPage.getFirstProductName();
    expect(firstName).toBe('Sauce Labs Onesie');
  });
});