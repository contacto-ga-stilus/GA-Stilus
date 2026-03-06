# 🚀 Guía Rápida de Configuración - Firebase Admin Setup

Sigue estos pasos en orden para que tu panel de admin funcione con seguridad.

---

## ✅ Paso 1: Habilitar Firebase Authentication

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto **ga-stilus-prd**
3. En el menú izquierdo, click en **Authentication**
4. Click en pestaña **Sign-in method**
5. Click en **Email/Password**
6. Activa el toggle (enciéndelo)
7. Click en **Save**

✅ **¡Listo!** La autenticación ya está habilitada.

---

## ✅ Paso 2: Descargar Cuenta de Servicio

1. En Firebase Console, haz click en el **ícono de engranaje** (Project Settings)
2. Click en pestaña **Service Accounts**
3. Asegúrate de que está seleccionado **Node.js**
4. Click en **Generate New Private Key**
5. Se descargará un archivo JSON (algo como `ga-stilus-prd-xxxxx.json`)

---

## ✅ Paso 3: Copiar la Clave de Servicio

1. Abre la carpeta de tu proyecto en tu computadora
2. Busca el archivo JSON que se descargó en el Paso 2
3. **Cópialo a la carpeta raíz del proyecto**
4. **Renómbralo a:** `serviceAccountKey.json`

Estructura final:
```
GA-Stilus/
  serviceAccountKey.json  ← Aquí va el archivo
  firestore.rules
  storage.rules
  scripts/
    set-admin.js
  ...
```

---

## ✅ Paso 4: Instalar Dependencias

Abre una terminal en tu proyecto y ejecuta:

```bash
npm install
```

Esto instalará `firebase-admin` que especificamos en `package.json`.

---

## ✅ Paso 5: Crear Usuario Administrador

En la terminal, ejecuta:

```bash
node scripts/set-admin.js "nombre_usuario" "contraseña"
```

**Ejemplo:**
```bash
node scripts/set-admin.js "juan" "MiContraseña123!"
```

**Resultado esperado:**
```
✅ Firebase Admin SDK inicializado correctamente

📝 Creando usuario "juan"...
✅ Usuario creado en Firebase
   UID: l5vQx8mK9nOpQrS2tUvWxYz

🔐 Asignando permisos de admin...
✅ Claim admin asignado

💾 Guardando datos en Firestore...
✅ Datos guardados en Firestore

==================================================
✅ USUARIO ADMINISTRADOR CREADO EXITOSAMENTE
==================================================

Credenciales:
  Usuario: juan
  Contraseña: (la que ingresaste)

El usuario ya puede iniciar sesión en /admin
```

**Nota:** Puedes crear más usuarios admins repitiendo este paso tantas veces como necesites.

---

## ✅ Paso 6: Desplegar las Reglas

Puedes publicar las reglas directamente desde la **Firebase Console** o usando la CLI. 

### Opción A (más simple):
1. Abre la consola de Firebase > Firestore > Rules y pega el contenido de `firestore.rules`.
2. Ve a Storage > Rules y pega el contenido de `storage.rules`.
3. Presiona **Publish** en cada caso.

### Opción B (CLI, no requiere `firebase.json`):
Simplemente ejecuta en la terminal:

```bash
firebase deploy --only firestore:rules,storage
```

> No necesitas un `firebase.json` para esto; la CLI funciona correctamente aunque no exista, siempre que hayas hecho `firebase login` y el proyecto esté seleccionado.

Este paso asegura que las reglas de seguridad que validan que solo admins pueden escribir estén activas.

---

---

## ✅ Paso 7: Probar el Login

1. Ve a `http://localhost:3000/admin` (o tu URL del admin)
2. Ingresa:
   - **Usuario:** `juan` (el que creaste en Paso 5)
   - **Contraseña:** `MiContraseña123!` (la que creaste)
3. Click en **Entrar**
4. ✅ Deberías ver el dashboard del admin

---

## ⚠️ Si algo sale mal...

### Error: "User not found"
- El usuario no existe. Repite Paso 5 con un nombre nuevo.

### Error: "Contraseña incorrecta"
- Verificaque escribiste correctamente la contraseña.
- Recuerda que es sensible a mayúsculas/minúsculas.

### Error: "serviceAccountKey.json not found"
- El archivo no está en la raíz del proyecto. Repite Paso 3.

### Error: "Missing or insufficient permissions" en admin
- Las reglas no se desplegaron. Repite Paso 6.

### Error: "Acceso Denegado" en admin
- El usuario fue creado pero algo falló en los permisos.
- Contacta directamente: el archivo de servicio podría tener problemas.

---

## 🔒 Seguridad

✅ **Lo que implementamos:**
- Login con usuario + contraseña (no email)
- Base de datos segura con Firestore
- Custom claims para permisos admin
- Reglas que bloquean acceso no autorizado
- Validación en productos y categorías

✅ **Tu contraseña se enva a Firebase (cifrada)**
- Solo admins pueden escribir productos
- El email oculto nunca se muestra al usuario

---

## 📝 Notas Importantes

1. **El email es oculto** - Internamente usamos `usuario@ga-stilus.local` pero tú solo ves "usuario"
2. **No commits `serviceAccountKey.json`** - Ya está en `.gitignore`
3. **Crea más usuarios cuando necesites** - Solo repite Paso 5
4. **Si olvidas una contraseña** - Usa Firebase Console para resetear el usuario

---

## 🎉 ¡Listo!

Tu panel admin ahora es:
- ✅ Seguro (con autenticación profesional)
- ✅ Escalable (múltiples usuarios admin)
- ✅ Simple (solo usuario + contraseña)
- ✅ Flexible (crea usuarios cuando necesites)

