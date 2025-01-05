const { db } = require('../config/firebase');

const addProduct = async (product) => {
  const productRef = db.collection('products').doc(product.id);
  await productRef.set({
    name: product.name,
    price: product.price,
    stock: product.stock,
    description: product.description,
    imageUrl: product.imageUrl,
  });
};

const getProducts = async () => {
  const productsSnapshot = await db.collection('products').get();
  return productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getProductById = async (id) => {
  const productDoc = await db.collection('products').doc(id).get();
  return productDoc.exists ? productDoc.data() : null;
}

module.exports = { addProduct, getProducts, getProductById };
