# Adopt-Meow 🐱

## Índice
- [Descripción del Proyecto](#descripción-del-proyecto)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Rutas de la API](#rutas-de-la-api)
  - [Autenticación](#autenticación)
  - [Usuarios](#usuarios)
  - [Mascotas](#mascotas)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)

## Descripción del Proyecto

**Adopt-Meow** es una plataforma diseñada para facilitar la adopción de gatos de manera segura y organizada. La API permite a los usuarios registrarse, gestionar perfiles, ver gatos disponibles para adopción y realizar solicitudes de adopción de manera eficiente.

## Instalación

Sigue estos pasos para instalar y configurar el proyecto localmente:

1. Clona el repositorio:
   ```sh
   git clone https://github.com/tu-usuario/adopt-meow-backend.git
   cd adopt-meow-backend
   ```
2. Instala las dependencias:
   ```sh
   npm install
   ```

## Configuración

Antes de ejecutar el proyecto, configura las variables de entorno creando un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
PORT=3000
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/AdoptMeow?retryWrites=true&w=majority
JWT_SECRET=tu_jwt_secreto
```

## Estructura del Proyecto

```sh
adopt-meow-backend/
├── controllers/
│   ├── auth.controller.js
│   ├── catsController.controller.js
├── middlewares/
│   ├── validateToken.js
│   ├── validator.middleware.js
├── models/
│   ├── cat.model.js
│   ├── userRegister.model.js
├── routes/
│   ├── authRegister.routes.js
│   ├── cats.routes.js
├── schemas/
│   ├── catSchema.js
│   ├── schemas.validatosjs
├── app.js
├── config.js
├── connectDB.js
└── package.json
```

## Rutas de la API

### Autenticación

- **Registro de usuario**
  ```http
  POST /api/register
  ```
  **Ejemplo de solicitud:**
  ```json
  {
    "username": "gatoLover",
    "email": "usuario@example.com",
    "password": "123456"
  }
  ```

- **Inicio de sesión**
  ```http
  POST /api/login
  ```
  **Ejemplo de solicitud:**
  ```json
  {
    "email": "usuario@example.com",
    "password": "123456"
  }
  ```

- **Cerrar sesión**
  ```http
  POST /api/logout
  ```

- **Obtener perfil del usuario autenticado**
  ```http
  GET /api/profile
  ```

### Usuarios

- **Obtener todos los usuarios** *(Requiere autenticación)*
  ```http
  GET /api/users
  ```

- **Obtener un usuario por ID** *(Requiere autenticación)*
  ```http
  GET /api/users/:id
  ```

### Mascotas

- **Registrar una nueva mascota** *(Requiere autenticación)*
  ```http
  POST /api/cats
  ```
  **Ejemplo de solicitud:**
  ```json
  {
    "name": "Whiskers",
    "age": 2,
    "breed": "Siames",
    "description": "Gato cariñoso y juguetón"
  }
  ```

- **Obtener la lista de mascotas disponibles para adopción**
  ```http
  GET /api/cats
  ```

- **Solicitar adopción de una mascota** *(Requiere autenticación)*
  ```http
  POST /api/cats/:id/adopt
  ```

## Tecnologías Utilizadas

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (JSON Web Tokens) para autenticación
- Bcrypt para encriptación de contraseñas
- Joi para validación de datos
- Morgan para logging
- CORS para manejo de solicitudes entre dominios

---

**Adopt-Meow** ha sido desarrollado para fomentar la adopción responsable de gatos, brindando una plataforma intuitiva y segura para conectar adoptantes con sus futuras mascotas. 🐱❤️

