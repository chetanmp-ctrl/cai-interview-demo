// pages/ProductsPage.js
class ProductsPage {
  constructor(page) {
    this.page = page;

    // Real SauceDemo locators
    this.productList = page.locator('.inventory_item');
    this.productTitle = page.locator('.inventory_item_name');
    this.addToCartButton = page.locator(
      '[data-test="add-to-cart-sauce-labs-backpack"]'
    );
    this.cartIcon = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.sortDropdown = page.locator(
      '[data-test="product_sort_container"]'
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
    await this.sortDropdown.selectOption(sortOption);
  }

  async getFirstProductName() {
    return await this.productTitle.first().textContent();
  }
}

module.exports = { ProductsPage };