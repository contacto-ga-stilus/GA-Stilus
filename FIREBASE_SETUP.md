# Configuración de Firebase para el proyecto `ga-stilus-prd`

Este documento describe los pasos para configurar Firebase Authentication, Firestore y Storage en el proyecto.

Este proyecto utiliza:
- **Firebase Authentication** - Para autenticar usuarios administradores
- **Firestore** - Para almacenar productos, categorías y datos de usuarios admin
- **Storage** - Para almacenar imágenes de productos

---

## 1. Configuración Inicial en Firebase Console

### 1.1 Habilitar Authentication

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Authentication** > **Sign-in method**
4. Habilita **Email/Password**:
   - Click en "Email/Password"
   - Activa "Email/password"
   - Click Save

---

## 2. Crear Usuarios Administrador (Automático)

Usa el script `scripts/set-admin.js` para crear usuarios automáticamente:

```bash
node scripts/set-admin.js "mi_usuario" "mi_contraseña_fuerte"
```

**¿Qué hace el script?**
1. ✅ Crea un usuario en Firebase Auth (con email oculto)
2. ✅ Asigna el claim `admin = true` automáticamente
3. ✅ Guarda los datos en la colección `admin_users` en Firestore
4. ✅ El usuario está listo para usar inmediatamente

**Ejemplo:**
```bash
node scripts/set-admin.js "juan" "MiContraseña123!"
```

**Resultado:**
```
✅ USUARIO ADMINISTRADOR CREADO EXITOSAMENTE
Credenciales:
  Usuario: juan
  Contraseña: (la que ingresaste)
```

---

## 3. Reglas de Firestore

Las reglas están en `firestore.rules`:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Productos
    match /productos/{productoId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Categorías
    match /categorias/{categoriaId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Admin users (solo lectura para los admins)
    match /admin_users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Todo lo demás bloqueado
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**¿Cómo funciona?**
- ✅ Cualquiera puede leer productos y categorías
- ✅ Solo usuarios con `admin == true` pueden escribir/crear/editar
- ✅ Los datos de cada usuario admin solo los puede leer él mismo

---

## 4. Reglas de Storage

Las reglas están en `storage.rules`:

```firestore
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Carpeta de productos (lectura pública, escritura solo para admins)
    match /productos/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 5. Estructura de Datos en Firestore

### Colección `admin_users`

Cada usuario administrador tiene un documento aquí:

```json
{
  "username": "juan",
  "email": "juan@ga-stilus.local",  // Email oculto (uso interno)
  "admin": true,
  "createdAt": 2025-03-06T...
}
```

**Nota:** El email es oculto, el usuario solo ve su nombre de usuario.

---

## 6. Variables de Entorno

Asegúrate de tener un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Obtén estos valores de **Firebase Console > Project Settings**.

---

## 7. Instalación de Dependencias

```bash
npm install
```

Esto instala `firebase-admin` que necesita el script de creación de usuarios.

---

## 8. Desplegar las Reglas

Puedes publicar las reglas directamente desde la **Firebase Console** o usando la CLI; un `firebase.json` no es obligatorio.

### Opción A – Consola (recomendada para usuarios de Vercel)
1. Abre la consola de Firebase → **Firestore** → **Rules**.
2. Copia el contenido de `firestore.rules` y pégalo en el editor.
3. Haz clic en **Publish**.
4. Ve a **Storage** → **Rules** y repite el proceso con `storage.rules`.

### Opción B – CLI (funciona sin firebase.json)
```bash
firebase login             # solo la primera vez
firebase use --add          # elige tu proyecto si no lo has hecho
firebase deploy --only firestore:rules,storage
```

> La CLI descargará el proyecto desde tu cuenta; no necesitas inicializarlo ni crear `firebase.json`. Esto solo publica las reglas especificadas.

Al finalizar tendrás las reglas de seguridad activas y limitando escritura solo a admins.

---

## 9. Código Cliente

### Hook `useAuth()` 

Ubicado en [app/components/Auth.tsx](app/components/Auth.tsx):

```typescript
const {
  user,           // Usuario actual (objeto de Firebase)
  username,       // Nombre de usuario
  isAuthenticated,// ¿Está logueado?
  isAdmin,        // ¿Tiene permiso admin?
  isLoading,      // ¿Está cargando?
  error,          // Mensajes de error
  login,          // Función para login
  logout,         // Función para logout
} = useAuth();
```

### Ejemplo de uso:

```typescript
const { username, isAuthenticated, login } = useAuth();

const handleLogin = async () => {
  const success = await login("juan", "MiContraseña123!");
  if (success) {
    console.log(`Bienvenido ${username}!`);
  }
};
```

---

## 10. Flujo de Login

1. **Usuario ingresa:** `usuario` + `contraseña`
2. **Internamente:** Se convierte a `usuario@ga-stilus.local` + `contraseña`
3. **Firebase Auth:** Valida las credenciales
4. **Se obtiene:** Token con claim `admin == true`
5. **Firestore/Storage:** Validan el claim y permiten operaciones
6. ✅ **Si es admin:** Acceso al panel
7. ❌ **Si NO es admin:** "Acceso Denegado"

---

## 11. Crear Más Usuarios Admin

Para agregar más usuarios administradores, simplemente repite:

```bash
node scripts/set-admin.js "nuevo_usuario" "su_contraseña"
```

Puedes crear cuantos necesites.

---

## 12. Troubleshooting

### "Missing or insufficient permissions"
- El usuario no tiene el claim `admin`. 
- Verifica que el script se ejecutó correctamente.
- El usuario debe cerrar sesión y volver a iniciar.

### "User not found" o "Contraseña incorrecta"
- El usuario no existe o la contraseña es incorrecta.
- Crea un nuevo usuario con el script.

### "serviceAccountKey.json not found"
- Descarga la clave desde Firebase Console > Project Settings > Service Accounts
- Cópiala a la raíz del proyecto con ese nombre exacto.

### "Acceso Denegado" en el admin
- El usuario fue creado pero no es admin.
- Contacta si cree que hay un error en la creación.

---

## 13. Seguridad

✅ **Lo que implementamos:**
- Autenticación con usuario + contraseña
- Firebase Auth como middleware seguro
- Custom claims para autorización
- Reglas que validan permisos en base de datos
- Email oculto (usuario nunca lo ve)
- Múltiples usuarios simultáneamente

✅ **Mejor práctica:**
- Cambiar contraseñas regularmente
- Usar contraseñas fuertes
- NO compartir `serviceAccountKey.json`
- Auditar acceso en Firebase Console

---

## 14. Recursos

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firebase Custom Claims](https://firebase.google.com/docs/auth/admin/custom-claims)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security)
- [Firebase Storage Rules](https://firebase.google.com/docs/storage/security)

---

## 15. Pasos Rápidos (Resumen)

1. Habilitar Email/Password en Firebase Console
2. Descargar `serviceAccountKey.json`
3. Copiar a la raíz del proyecto
4. `npm install`
5. `node scripts/set-admin.js "usuario" "password"`
6. `firebase deploy --only firestore:rules,storage`
7. ✅ Listo para usar