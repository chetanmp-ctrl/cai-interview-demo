// pages/LoginPage.js
class LoginPage {
  constructor(page) {
    this.page = page;

    // SauceDemo real locators
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.locator('#login-button');
    this.errorMessage = page.locator(
      '[data-test="error"]'
    );
  }

  async navigate() {
    await this.page.goto('https://www.saucedemo.com');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  async isLoggedIn() {
    return await this.page.url()
      .includes('/inventory.html');
  }
}

module.exports = { LoginPage };