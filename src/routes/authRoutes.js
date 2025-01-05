const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase');

const validateRequest = require('../middleware/validateRequest');

const {
  createUser,
  getUserById
} = require('../services/userService');

require('dotenv').config();

const router = express.Router();

router.post('/register', validateRequest(['username', 'password', 'email']), async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const authRef = db.collection('auth');
    const userRef = db.collection('users');

    const existingUser = await authRef.where('username', '==', username).get();
    if (!existingUser.empty) {
      return res.status(400).send({ error: 'Username already exists' });
    }

    const existingEmail = await userRef.where('email', '==', email).get();
    if (!existingEmail.empty) {
      return res.status(400).send({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const batch = db.batch();
    const authDoc = authRef.doc();
    const userDoc = userRef.doc();

    batch.set(authDoc, {
      username,
      password: hashedPassword,
      createdAt: new Date(),
    });

    batch.set(userDoc, {
      username,
      email,
      createdAt: new Date(),
    });

    await batch.commit();

    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error registering user' });
  }
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ error: 'All fields are required' });
  }

  try {
    const authRef = db.collection('auth');

    const userDoc = await authRef.where('username', '==', username).get();
    if (userDoc.empty) {
      return res.status(400).send({ error: 'Invalid username or password' });
    }

    const userData = userDoc.docs[0].data();

    const validPassword = await bcrypt.compare(password, userData.password);
    if (!validPassword) {
      return res.status(400).send({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ username: userData.username  }, process.env.JSON_WEB_TOKEN_SECRET);

    res.status(200).send({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error logging in' });
  }
});

module.exports = router;
