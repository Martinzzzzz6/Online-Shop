class User {
  constructor(id, email, name, cart = []) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.cart = cart; 
  }

  addToCart(productId, quantity) {
    const existingProduct = this.cart.find((item) => item.productId === productId);
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      this.cart.push({ productId, quantity });
    }
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter((item) => item.productId !== productId);
  }

  clearCart() {
    this.cart = [];
  }
}
module.exports = User;
