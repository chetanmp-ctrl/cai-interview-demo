// pages/ProductionOrderPage.js
class ProductionOrderPage {
  constructor(page) {
    this.page = page;

    // Order form locators
    this.orderNumberInput = page.locator('[data-testid="order-number"]');
    this.materialCodeInput = page.locator('[data-testid="material-code"]');
    this.quantityInput = page.locator('[data-testid="quantity"]');
    this.lotNumberInput = page.locator('[data-testid="lot-number"]');
    this.warehouseDropdown = page.locator('[data-testid="warehouse"]');
    this.submitButton = page.locator('[data-testid="submit-order"]');

    // Result locators
    this.orderStatus = page.locator('[data-testid="order-status"]');
    this.lotTraceabilityLink = page.locator('[data-testid="lot-trace"]');
    this.errorMessage = page.locator('[data-testid="error-msg"]');
    this.successBanner = page.locator('.success-notification');
  }

  async navigate() {
    await this.page.goto('/production-orders/new');
  }

  async createOrder({ orderNumber, materialCode, quantity,
    lotNumber, warehouse }) {
    await this.orderNumberInput.fill(orderNumber);
    await this.materialCodeInput.fill(materialCode);
    await this.quantityInput.fill(String(quantity));
    if (lotNumber) await this.lotNumberInput.fill(lotNumber);
    if (warehouse) {
      await this.warehouseDropdown.selectOption(warehouse);
    }
    await this.submitButton.click();
  }

  async getOrderStatus() {
    await this.orderStatus.waitFor({ state: 'visible' });
    return await this.orderStatus.textContent();
  }

  async getLotTraceabilityNumber() {
    return await this.lotTraceabilityLink.textContent();
  }
}

module.exports = { ProductionOrderPage };