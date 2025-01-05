const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

if (process.env.NODE_ENV === 'development') {
  db.useEmulator('localhost', 8080);
}

module.exports = { db };
