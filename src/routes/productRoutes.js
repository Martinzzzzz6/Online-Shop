const express = require('express');
const { addProduct, getProducts, getProductById } = require('../services/productService');

const router = express.Router();

router.post('/postProduct', async (req, res) => {
  try {
    await addProduct(req.body);
    res.status(201).json({ message: 'Product added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

router.get('/', async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await getProductById(req.params.name);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

module.exports = router;
