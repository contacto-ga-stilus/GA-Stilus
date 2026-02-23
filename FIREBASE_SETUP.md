# Configuración de Firebase para el panel admin

Este proyecto utiliza Firestore y Storage para almacenar productos de caballero y categorías.
Para evitar el error `Missing or insufficient permissions` debes configurar reglas y asignar un rol de administrador.

## 1. Reglas de Firestore

Copia el siguiente contenido en la consola de Firebase (Firestore > Rules) o en `firestore.rules` y despliega:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Productos
    match /productos/{productoId} {
      allow read: if true;
      allow write: if request.auth != null; // cualquiera autenticado puede escribir
    }
    // Categorías
    match /categorias/{categoriaId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    // Bloquear todo lo demás
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

> Si desea restringir la escritura sólo a administradores, cambie `if request.auth != null` por `if request.auth.token.admin == true`.

## 2. Reglas de Storage

Copia en la consola (Storage > Rules) o en `storage.rules`:

```js
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /productos_caballero/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

## 3. Asignar claim `admin`

Para que la aplicación sepa quién es administrador hay que anotar el usuario con un `custom claim`.
Hay un script incluido en el repositorio: `scripts/set-admin.js`. Ejemplo de uso:

```bash
# primero descarga la clave de servicio en serviceAccountKey.json en la raíz
node scripts/set-admin.js <UID_DEL_USUARIO>
```

Esto marca al usuario como admin; al entrar en la app su token contendrá `claims.admin === true`.


## 4. Despliegue de reglas

Instala Firebase CLI si no lo tienes:

```bash
npm install -g firebase-tools
firebase login
```

Desde la raíz del proyecto ejecuta:

```bash
firebase deploy --only firestore:rules
firebase deploy --only storage
```

O simplemente pega y publica las reglas manualmente en la consola.


## 5. Código cliente

El componente `CaballeroProductos.tsx` ya comprueba `isAdmin` y oculta los botones/formularios de escritura cuando el usuario no es administrador. Si un usuario no admin intenta llamar a los métodos protegidos recibirá un `alert`.


## 6. Troubleshooting

1. Asegúrate de haber iniciado sesión con Firebase en el cliente (`auth.currentUser` no debe ser `null`).
2. Refresca el token tras asignar el claim (`await auth.currentUser.getIdToken(true)`).
3. Revoca permisos en la consola si necesitas probar otro comportamiento.

Con esto deberías dejar de ver el error de permisos en la consola.