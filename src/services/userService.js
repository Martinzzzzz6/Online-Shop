const { db } = require('../config/firebase');

const createUser = async (user) => {
  const userRef = db.collection('users').doc(user.id);
  await userRef.set({ email: user.email, name: user.name, cart: user.cart });
};

const getUserById = async (id) => {
  const userDoc = await db.collection('users').doc(id).get();
  return userDoc.exists ? userDoc.data() : null;
};

const updateUserCart = async (userId, cart) => {
  const userRef = db.collection('users').doc(userId);
  await userRef.update({ cart });
};


const getUserByName = async (name) => {
  const userDoc = await db.collection('users').doc(name).get();
  return userDoc.exists ? userDoc.data() : null;
};

const listUsers = async (page, limit) => {
  const usersRef = db.collection('users');
  const snapshot = await usersRef.get();
  return snapshot.docs.map((doc) => doc.data());
};

module.exports = { createUser, getUserById, getUserByName, listUsers, updateUserCart };
