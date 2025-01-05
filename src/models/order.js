const addOrder = async (order) => {
  const orderRef = db.collection('orders').doc(order.id);
  await orderRef.set({
    userId: order.userId,
    items: order.items,
    totalAmount: order.totalAmount,
    status: order.status,
    createdAt: new Date(),
  });
};

const getOrdersByUserId = async (userId) => {
  const ordersSnapshot = await db.collection('orders').where('userId', '==', userId).get();
  return ordersSnapshot.docs.map(doc => doc.data());
};

module.exports = { addOrder, getOrdersByUserId };
