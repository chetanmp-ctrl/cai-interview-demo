// tests/e2e/login.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { testUsers } = require('../data/testData');

test.describe('Login Module — SauceDemo', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('Valid user logs in successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(
      testUsers.admin.username,
      testUsers.admin.password
    );
    // After login URL changes to inventory page
    await expect(page).toHaveURL(
      'https://www.saucedemo.com/inventory.html'
    );
  });

  test('Locked out user sees error message', 
    async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(
      testUsers.lockedUser.username,
      testUsers.lockedUser.password
    );
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('locked out');
  });

  test('Invalid credentials show error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(
      testUsers.invalidUser.username,
      testUsers.invalidUser.password
    );
    const error = await loginPage.getErrorMessage();
    expect(error).toContain(
      'Username and password do not match'
    );
  });

  test('Empty credentials show validation error',
    async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(
      testUsers.emptyUser.username,
      testUsers.emptyUser.password
    );
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username is required');
  });
});