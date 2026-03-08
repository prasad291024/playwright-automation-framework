/**
 * SauceDemo Application Configuration
 */

export const saucedemoConfig = {
  name: 'SauceDemo',
  baseUrl: 'https://www.saucedemo.com',
  storageState: 'storage-state/saucedemo.json',
  authType: 'username',
  authEndpoint: '/',
  timeouts: {
    page: 15000,
    action: 8000,
    navigation: 20000,
  },
  selectors: {
    login: {
      usernameInput: '#user-name',
      passwordInput: '#password',
      loginButton: '#login-button',
    },
    inventory: {
      inventoryList: '.inventory_list',
      addToCartButton: '.inventory_item button',
    },
    cart: {
      cartIcon: '.shopping_cart_link',
      cartItem: '.cart_item',
    },
  },
  features: ['auth', 'inventory', 'cart'],
  retryStrategy: 'standard',
  tags: ['@saucedemo', '@ecommerce'],
};
