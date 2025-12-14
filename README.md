## Description

**Main Layers:**

The application follows a modular architecture using NestJS, organized in layers:

- **Controllers:** Handle HTTP requests, validate input, and delegate business logic to services (e.g., `DestinationsController`).
- **Services:** Contain the business logic (e.g., `DestinationsService` for managing destinations).
- **Entities/Repositories:** Define database tables and manage persistence using TypeORM (e.g., `Destination`, `Booking`, `User`).
- **DTOs:** Validate and type incoming/outgoing data using `class-validator` and `class-transformer`.
- **Modules:** Organized by functionality:
  - `AuthModule`: Authentication and authorization (JWT, roles)
  - `UsersModule`: User and role management
  - `DestinationsModule`: Tourist destination management
  - `BookingsModule`: Booking management and association with destinations and users

  ## Authentication Implementation

The application uses JWT-based authentication to secure endpoints and manage access by roles:

- **AuthModule**: Handles authentication, imports `UsersModule`, registers `JwtModule`, and provides `AuthService` and `JwtStrategy`.
- **AuthController**: Public endpoint `POST /auth/login` accepts `email` and `password`, validates via `AuthService`, and returns a JWT (`access_token`) with user info.
- **AuthService**: Validates users with `bcrypt`, generates JWT containing user ID, email, and roles, with configurable expiration.
- **JwtAuthGuard**: Protects routes, checks for `@Public()` routes, and throws `UnauthorizedException` if token is invalid or expired.
- **Role-Based Access**: Roles in JWT payload allow endpoint access control using `@Roles()` decorator.

**Flow**: User logs in → validated → JWT issued → included in `Authorization` header → `JwtAuthGuard` verifies token on each request.

## Pagination and Filters

The application implements pagination and filters to optimize list queries and enhance the user experience.

- **Global DTO `FilterPaginateDto`**:
  - Contains `page` and `limit` properties used in endpoints that return lists of data.
  - `page`: Page number to query (default is 1).
  - `limit`: Number of records per page (default is 10).
  - Automatic transformations ensure that values sent as query parameters are treated as numbers (`@Transform` + `@IsNumber`).

  - `FilterPaginateDto` can be combined with other specific filter DTOs (e.g., `FilterDestinationDto` for destinations or `FilterUsersDto` for users), creating a reusable and consistent pattern across all list endpoints.

This approach standardizes pagination and makes it easier to apply filters in all API endpoints.

## Design Decisions

### Use of the `@Public()` Decorator

To handle public routes within a JWT-based authentication system, a custom `@Public()` decorator was created. This decorator marks endpoints that do not require an access token, allowing unauthenticated users to access them (for example, the login endpoint `/auth/login`).  
It simplifies access management and avoids the need to create separate guards or conditionals within the `JwtAuthGuard` for each public route.

### Docker Setup for Development

The provided `docker-compose.yml` file (version `'3.9'`) sets up only the PostgreSQL database and PGAdmin.  
It does **not** run the API, which allows full use of live-reloading and automatic code updates during development.

## Prerequisites

To clone, configure, and run this project locally, you need the following software installed:

| Software                    | Versión Requerida      |
| :-------------------------- | :--------------------- |
| **Node.js**                 | LTS (v20.x o superior) |
| **npm**                     | v9.x o superior        |
| **Docker & Docker Compose** | Última versión estable |
| **PostgreSQL**              | Versión 15             |

## Environment Variables Setup

The project uses environment variables for configuration. **You must create a `.env` file in the project root.**

1.  **Create the `.env` file:**
    - Copy the example file **`env.example`** and rename it to **`.env`**.
    - _Use `env.example` as a template and guide to configure all required values for the application and the database._

2.  **Configure Variables:**
    - Edit the new `.env` file and replace the example values with your local configuration (especially the database password and the `JWT_SECRET` key).

## Key Environment Variables

For a quick reference, these are the most important variables defined in the **`env.example`** file:

| Variable                                            | Service    | Description                                                                                  | Example / Default |
| :-------------------------------------------------- | :--------- | :------------------------------------------------------------------------------------------- | :---------------- |
| `PORT`                                              | API        | Port on which the API will run.                                                              | `3000`            |
| `DB_HOST`                                           | PostgreSQL | DB Host. (**Use `postgres` if the API runs INSIDE Docker**; `localhost` if running outside). | `localhost`       |
| `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`  | PostgreSQL | Database credentials and configuration.                                                      | See `env.example` |
| `PGADMIN_DEFAULT_EMAIL`, `PGADMIN_DEFAULT_PASSWORD` | PgAdmin    | Credentials to access the administration interface.                                          | `admin@admin.com` |
| `NODE_ENV`                                          | API        | Application environment.                                                                     | `development`     |
| `JWT_SECRET`                                        | API        | Secret key for signing authentication tokens.                                                | _Must be changed_ |

## Project setup

```bash
$ npm install
```

## Docker

To build the images and start all the services defined in Docker, remember to copy the `docker-compose.example.yml` file and rename it to `docker-compose.yml`, and do the same with `Dockerfile.example` to `Dockerfile`.

```bash
# Build the images and start the Docker Compose services
$ docker-compose up --build
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Migration

Before generating a migration, ensure that the src/migrations folder exists in your project. If it doesn't exist, create it.

```bash
# Generate a new migration using TypeORM.
$ npm run migration:generate -- src/migrations/InitialMigration

# Execute the migration as well.
$ npm run migration:run

```

## Seeds

```bash
# Run seeds to populate the database with initial data.
$ npm run seed:run
```

## Run tests

```bash
# e2e tests
$ npm run test:e2e
```
