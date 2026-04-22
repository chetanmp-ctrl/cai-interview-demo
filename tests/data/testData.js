// tests/data/testData.js
const testUsers = {
  admin: {
    username: 'standard_user',
    password: 'secret_sauce'
  },
  lockedUser: {
    username: 'locked_out_user',
    password: 'secret_sauce'
  },
  invalidUser: {
    username: 'invalid_user',
    password: 'wrong_password'
  },
  emptyUser: {
    username: '',
    password: ''
  }
};

const productData = {
  firstProduct: 'Sauce Labs Backpack',
  secondProduct: 'Sauce Labs Bike Light',
  sortOptions: {
    nameAZ: 'az',
    nameZA: 'za',
    priceLowHigh: 'lohi',
    priceHighLow: 'hilo'
  }
};

module.exports = { testUsers, productData };