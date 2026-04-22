// tests/e2e/products.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { ProductsPage } = require('../../pages/ProductsPage');
const { testUsers, productData } = require('../data/testData');

test.describe('Products Module — SauceDemo', () => {

  // Login before each test
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(
      testUsers.admin.username,
      testUsers.admin.password
    );
    // Verify we are on products page
    await expect(page).toHaveURL(
      'https://www.saucedemo.com/inventory.html'
    );
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

  test('Sort products by name A to Z', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.sortProducts(
      productData.sortOptions.nameAZ
    );
    const firstName = 
      await productsPage.getFirstProductName();
    expect(firstName).toBe('Sauce Labs Backpack');
  });

  test('Sort products by price low to high',
    async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.sortProducts(
      productData.sortOptions.priceLowHigh
    );
    const firstName = 
      await productsPage.getFirstProductName();
    expect(firstName).toBe('Sauce Labs Onesie');
  });
});