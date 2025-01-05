const express = require('express');
const { db } = require('../config/firebase');
const authenticateToken = require('../middleware/authenticateUser');

const router = express.Router();


router.post('/cart', authenticateToken, async (req, res) => {
  const { itemId } = req.body;
  const userId = req.user.id;

  if (!itemId) {
    return res.status(400).json({ error: 'Item ID is required.' });
  }

  try {
    const cartRef = db.collection('carts').doc(userId);
    const cartDoc = await cartRef.get();

    if (cartDoc.exists) {
      const cart = cartDoc.data();
      cart.items.push(itemId);
      await cartRef.update({ items: cart.items });
    } else {
      await cartRef.set({ items: [itemId] });
    }

    res.status(201).json({ message: 'Item added to cart successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add item to cart.' });
  }
});


router.get('/cart', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const cartRef = db.collection('carts').doc(userId);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists) {
      return res.status(404).json({ error: 'Cart not found.' });
    }

    res.status(200).json(cartDoc.data());
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch cart.' });
  }
});


router.delete('/cart/:itemId', authenticateToken, async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user.id;

  try {
    const cartRef = db.collection('carts').doc(userId);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists) {
      return res.status(404).json({ error: 'Cart not found.' });
    }

    const cart = cartDoc.data();
    const updatedItems = cart.items.filter(item => item !== itemId);

    await cartRef.update({ items: updatedItems });

    res.status(200).json({ message: 'Item removed from cart successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove item from cart.' });
  }
});

module.exports = router;
