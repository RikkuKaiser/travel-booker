## Descripción

**Capas Principales:**

La aplicación sigue una arquitectura modular utilizando NestJS, organizada en capas:

- **Controllers:** Manejan las peticiones HTTP, validan la entrada y delegan la lógica de negocio a los servicios (ej. `DestinationsController`).
- **Services:** Contienen la lógica de negocio (ej. `DestinationsService` para la gestión de destinos).
- **Entities/Repositories:** Definen las tablas de la base de datos y gestionan la persistencia utilizando TypeORM (ej. `Destination`, `Booking`, `User`).
- **DTOs:** Validan y tipan los datos entrantes/salientes utilizando `class-validator` y `class-transformer`.
- **Modules:** Organizados por funcionalidad:
  - `AuthModule`: Autenticación y autorización (JWT, roles)
  - `UsersModule`: Gestión de usuarios y roles
  - `DestinationsModule`: Gestión de destinos turísticos
  - `BookingsModule`: Gestión de reservas y asociación con destinos y usuarios

---

## Implementación de Autenticación

La aplicación utiliza autenticación basada en JWT para asegurar los _endpoints_ y gestionar el acceso por roles:

- **AuthModule**: Maneja la autenticación, importa `UsersModule`, registra `JwtModule` y provee `AuthService` y `JwtStrategy`.
- **AuthController**: El _endpoint_ público `POST /auth/login` acepta `email` y `password`, valida a través de `AuthService` y retorna un JWT (`access_token`) con la información del usuario.
- **AuthService**: Valida usuarios con `bcrypt`, genera el JWT que contiene el ID de usuario, email y roles, con expiración configurable.
- **JwtAuthGuard**: Protege las rutas, verifica si hay rutas `@Public()` y lanza `UnauthorizedException` si el _token_ es inválido o ha expirado.
- **Acceso Basado en Roles**: Los roles en el _payload_ del JWT permiten el control de acceso a los _endpoints_ utilizando el decorador `@Roles()`.

**Flujo**: El usuario inicia sesión → validado → se emite el JWT → incluido en el _header_ `Authorization` → `JwtAuthGuard` verifica el _token_ en cada solicitud.

---

## Paginación y Filtros

La aplicación implementa paginación y filtros para optimizar las consultas de listas y mejorar la experiencia del usuario.

- **DTO Global `FilterPaginateDto`**:
  - Contiene las propiedades `page` y `limit` utilizadas en _endpoints_ que retornan listas de datos.
  - `page`: Número de página a consultar (el valor por defecto es 1).
  - `limit`: Número de registros por página (el valor por defecto es 10).
  - Las transformaciones automáticas aseguran que los valores enviados como parámetros de consulta sean tratados como números (`@Transform` + `@IsNumber`).
- `FilterPaginateDto` puede combinarse con otros DTOs de filtro específicos (ej. `FilterDestinationDto` para destinos o `FilterUsersDto` para usuarios), creando un patrón reutilizable y consistente en todos los _endpoints_ de listado.

Este enfoque estandariza la paginación y facilita la aplicación de filtros en todos los _endpoints_ de la API.

---

## Decisiones de Diseño

### Uso del Decorador `@Public()`

Para manejar rutas públicas dentro de un sistema de autenticación basado en JWT, se creó un decorador `@Public()` personalizado. Este decorador marca los _endpoints_ que no requieren un _access token_, permitiendo a los usuarios no autenticados acceder a ellos (por ejemplo, el _endpoint_ de inicio de sesión `/auth/login`).
Simplifica la gestión de accesos y evita la necesidad de crear _guards_ separados o condicionales dentro de `JwtAuthGuard` para cada ruta pública.

### Configuración de Docker para Desarrollo

El archivo `docker-compose.yml` proporcionado (versión `'3.9'`) configura solo la base de datos PostgreSQL y PGAdmin.
**No** ejecuta la API, lo que permite el uso completo de la recarga en vivo (_live-reloading_) y las actualizaciones automáticas de código durante el desarrollo.

---

## Métricas y Monitoreo (Planificado)

Aunque el proyecto actualmente no expone métricas de tiempo de ejecución, la arquitectura está diseñada para permitir una fácil integración con herramientas de monitoreo como **Grafana** o **DataDog**.

### Enfoque de Implementación Posible:

- Utilizar métricas compatibles con **Prometheus** a través de un módulo de NestJS como [`nestjs-prometheus`](https://www.npmjs.com/package/nestjs-prometheus).
- Rastrear métricas clave como:
  - Recuentos de solicitudes HTTP y latencia por _endpoint_
  - Tasas de error y códigos de estado
  - Rendimiento de las consultas a la base de datos
- Exponer un _endpoint_ `/metrics` que pueda ser consultado por Prometheus.
- Conectar Prometheus a Grafana para crear _dashboards_ para:
  - Tendencias de uso de la API
  - Monitoreo de errores
  - Rendimiento del sistema

Esta configuración permite que el proyecto escale y mantenga la observabilidad sin modificar los _controllers_ o _services_ existentes.

## Prerrequisitos

Para clonar, configurar y ejecutar este proyecto localmente, necesitas tener instalado el siguiente software:

| Software                    | Versión                |
| :-------------------------- | :--------------------- |
| **Node.js**                 | LTS (v20.x o superior) |
| **npm**                     | v9.x o superior        |
| **Docker & Docker Compose** | Última versión estable |
| **PostgreSQL**              | Versión 15             |

## Configuración de Variables de Entorno

El proyecto utiliza variables de entorno para su configuración. **Debes crear un archivo `.env` en la raíz del proyecto.**

1.  **Crear el archivo `.env`:**
    - Copia el archivo de ejemplo **`env.example`** y renómbralo a **`.env`**.
    - _Utiliza `env.example` como plantilla y guía para configurar todos los valores requeridos para la aplicación y la base de datos._

2.  **Configurar Variables:**
    - Edita el nuevo archivo `.env` y reemplaza los valores de ejemplo con tu configuración local (especialmente la contraseña de la base de datos y la clave `JWT_SECRET`).

## Variables de Entorno Clave

Para una referencia rápida, estas son las variables más importantes definidas en el archivo **`env.example`**:

| Variable                                            | Servicio   | Descripción                                                                                        | Ejemplo / Por Defecto |
| :-------------------------------------------------- | :--------- | :------------------------------------------------------------------------------------------------- | :-------------------- |
| `PORT`                                              | API        | Puerto en el que se ejecutará la API.                                                              | `3000`                |
| `DB_HOST`                                           | PostgreSQL | Host de la DB. (**Usar `postgres` si la API corre DENTRO de Docker**; `localhost` si corre fuera). | `localhost`           |
| `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`  | PostgreSQL | Credenciales y configuración de la base de datos.                                                  | Ver `env.example`     |
| `PGADMIN_DEFAULT_EMAIL`, `PGADMIN_DEFAULT_PASSWORD` | PgAdmin    | Credenciales para acceder a la interfaz de administración.                                         | `admin@admin.com`     |
| `NODE_ENV`                                          | API        | Entorno de la aplicación.                                                                          | `development`         |
| `JWT_SECRET`                                        | API        | Clave secreta para la firma de _tokens_ de autenticación.                                          | _Debe ser cambiada_   |

## Configuración del Proyecto

```bash
$ npm install
```

## Docker

Para construir las imágenes e iniciar todos los servicios definidos en Docker, recuerda copiar el archivo docker-compose.example.yml y renombrarlo a docker-compose.yml, y hacer lo mismo con Dockerfile.example a Dockerfile.

```bash
# Construye las imágenes e inicia los servicios de Docker Compose
$ docker-compose up --build
```

## Compilar y ejecutar el proyecto

```bash
# modo desarrollo
$ npm run start

# modo vigilancia (watch mode)
$ npm run start:dev

# modo producción
$ npm run start:prod
```

## Migration

Antes de generar una migración, asegúrate de que la carpeta src/migrations exista en tu proyecto. Si no existe, créala.

```bash
# Genera una nueva migración usando TypeORM.
$ npm run migration:generate -- src/migrations/InitialMigration

# Ejecuta también la migración.
$ npm run migration:run

```

## Seeds (Datos Iniciales)

```bash
# Ejecuta los seeds para poblar la base de datos con datos iniciales.
$ npm run seed:run
```

## Ejecutar Pruebas

```bash
# pruebas e2e (end-to-end)
$ npm run test:e2e
```
