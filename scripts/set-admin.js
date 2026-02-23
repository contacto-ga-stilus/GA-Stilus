// Usage: node scripts/set-admin.js <USER_UID>
// Requires a serviceAccountKey.json file at project root (download from Firebase Console)

const admin = require('firebase-admin');
const path = require('path');

// initialize with service account
const serviceAccount = require(path.resolve(__dirname, '../serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = process.argv[2];
if (!uid) {
  console.error('Usage: node set-admin.js <USER_UID>');
  process.exit(1);
}

admin.auth()
  .setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`Claim "admin" assigned to user ${uid}`);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error setting custom claim:', err);
    process.exit(1);
  });