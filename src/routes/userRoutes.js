const express = require('express');
const {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  listUsers,
  getUserByName
} = require('../services/userService');
const validateRequest = require('../middleware/validateRequest');
const authenticateToken = require('../middleware/authenticationToken');
const jwt = require('jsonwebtoken');
const router = express.Router() ;

router.post(
  '/',
  validateRequest(['id', 'email', 'name']),
  async (req, res) => {
    try {
      await createUser(req.body);
      res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
);

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.put(
  '/:id',
  authenticateToken,
  validateRequest(['email', 'name']),
  async (req, res) => {
    try {
      const updated = await updateUser(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'User not found' });
      res.json({ message: 'User updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update user' });
    }
  }
);

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await deleteUser(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const users = await listUsers(); 
    res.json(users);
  } catch (error) {
    res.status(500).send('Error fetching users');
  }
});


router.get('/name/:name', authenticateToken, async (req, res) => {
  const { name } = req.params;
  try {
    const user = await getUserByName(name);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.post('/:id/cart', authenticateToken, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const updatedCart = [...user.cart];
    const existingItem = updatedCart.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      updatedCart.push({ productId, quantity });
    }

    await updateUserCart(req.params.id, updatedCart);
    res.status(200).json({ message: 'Cart updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

router.post('/:id/checkout', authenticateToken, async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const totalAmount = user.cart.reduce((total, item) => {
      const product = getProductById(item.productId);
      return total + product.price * item.quantity;
    }, 0);

    const paymentIntent = await createPaymentIntent(totalAmount);

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

module.exports = router;
