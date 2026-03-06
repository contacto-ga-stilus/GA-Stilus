/**
 * Script para crear un usuario administrador en Firebase
 * 
 * Uso:
 * node scripts/set-admin.js <username> <password>
 * 
 * Ejemplo:
 * node scripts/set-admin.js "juan" "MiContraseña123!"
 * 
 * IMPORTANTE: Este script requiere:
 * 1. Tener Firebase Admin SDK instalado: npm install firebase-admin
 * 2. Una cuenta de servicio (serviceAccountKey.json) en la raíz del proyecto
 * 3. Descargar la cuenta de servicio desde: Firebase Console > Project Settings > Service Accounts > Generate New Private Key
 */

const admin = require('firebase-admin');
const path = require('path');

// Verificar que se haya proporcionado username y contraseña
if (process.argv.length < 4) {
  console.error('❌ Uso: node scripts/set-admin.js <username> <password>');
  console.error('Ejemplo: node scripts/set-admin.js "juan" "MiContraseña123!"');
  process.exit(1);
}

const username = process.argv[2];
const password = process.argv[3];

// Validaciones básicas
if (username.length < 3) {
  console.error('❌ El usuario debe tener al menos 3 caracteres');
  process.exit(1);
}

if (password.length < 6) {
  console.error('❌ La contraseña debe tener al menos 6 caracteres');
  process.exit(1);
}

// El email oculto se genera a partir del username
const hiddenEmail = `${username.toLowerCase()}@ga-stilus.local`;

// Inicializar Firebase Admin SDK
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');

try {
  const serviceAccount = require(serviceAccountPath);
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  
  console.log('✅ Firebase Admin SDK inicializado correctamente\n');
} catch (error) {
  console.error('❌ Error: No se encontró serviceAccountKey.json');
  console.error('   Descárgalo desde: Firebase Console > Project Settings > Service Accounts > Generate New Private Key');
  process.exit(1);
}

const auth = admin.auth();
const db = admin.firestore();

// Crear el usuario en Firebase Authentication
async function createAdminUser() {
  try {
    console.log(`📝 Creando usuario "${username}"...`);
    
    // Crear usuario en Firebase Auth
    const userRecord = await auth.createUser({
      email: hiddenEmail,
      password: password,
    });

    const uid = userRecord.uid;
    console.log(`✅ Usuario creado en Firebase`);
    console.log(`   UID: ${uid}`);

    // Asignar custom claim admin
    console.log(`\n🔐 Asignando permisos de admin...`);
    await auth.setCustomUserClaims(uid, { admin: true });
    console.log(`✅ Claim admin asignado`);

    // Guardar datos en Firestore
    console.log(`\n💾 Guardando datos en Firestore...`);
    await db.collection('admin_users').doc(uid).set({
      username: username,
      email: hiddenEmail,
      admin: true,
      createdAt: new Date(),
    });
    console.log(`✅ Datos guardados en Firestore`);

    console.log(`\n${'='.repeat(50)}`);
    console.log(`✅ USUARIO ADMINISTRADOR CREADO EXITOSAMENTE`);
    console.log(`${'='.repeat(50)}`);
    console.log(`\nCredenciales:`);
    console.log(`  Usuario: ${username}`);
    console.log(`  Contraseña: (la que ingresaste)`);
    console.log(`\nEl usuario ya puede iniciar sesión en /admin`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'auth/email-already-exists') {
      console.error('\n💡 Este usuario ya existe. Usa otro nombre de usuario.');
    }
    
    process.exit(1);
  }
}

createAdminUser();
