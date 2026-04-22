// pages/ProductsPage.js
class ProductsPage {
  constructor(page) {
    this.page = page;

    this.productList = page.locator('.inventory_item');
    this.productTitle = page.locator('.inventory_item_name');
    this.addToCartButton = page.locator(
      '[data-test="add-to-cart-sauce-labs-backpack"]'
    );
    this.cartIcon = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');

    // Fixed sort dropdown locator
    this.sortDropdown = page.locator(
      'select.product_sort_container'
    );
  }

  async getProductCount() {
    return await this.productList.count();
  }

  async addProductToCart() {
    await this.addToCartButton.click();
  }

  async getCartCount() {
    return await this.cartBadge.textContent();
  }

  async sortProducts(sortOption) {
    // Wait for dropdown to be visible first
    await this.sortDropdown.waitFor({ state: 'visible' });
    await this.sortDropdown.selectOption(sortOption);
  }

  async getFirstProductName() {
    // Wait for products to reload after sort
    await this.page.waitForTimeout(500);
    return await this.productTitle.first().textContent();
  }
}

module.exports = { ProductsPage };