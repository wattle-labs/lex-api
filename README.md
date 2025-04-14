# Lex API

## Overview

Lex API is a RESTful API built with TypeScript, Hono, and MongoDB.

## Getting Started

### Configuration

- Create a `.env` file in the root directory.
- Examples of environment variables can found in `.env.example` file.

### Running the Application

- **Development mode** (with hot reloading):

  ```bash
  pnpm dev
  ```

- **Build for production**:

  ```bash
  pnpm build
  ```

- **Start production server**:

  ```bash
  pnpm start
  ```

## API Documentation

API documentation is available at the `/api/docs` endpoint when the server is running. It's built using OpenAPI specification and Swagger UI.

## Project Structure

src/
├── app.ts # Application entry point
├── server.ts # Server setup
├── config/ # Configuration
├── constants/ # Constants and enums
├── controllers/ # Request handlers
├── interfaces/ # TypeScript interfaces for architecture
├── lib/ # Common libraries and utilities
├── middlewares/ # Express middlewares
├── models/ # Data models
│ ├── interfaces/ # TypeScript interfaces for data models
│ └── schemas/ # Mongoose schemas
├── repositories/ # Data access layer
├── routes/ # API routes
├── services/ # Business logic
├── types/ # TypeScript types
├── utils/ # Utility functions
└── validators/ # Input validation schemas


## Contributing

### Development Workflow

1. Create a new branch for your feature/fix:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them, and raise a PR.

### Code Style

- The project uses ESLint and Prettier for code style enforcement
- Run linting checks:

  ```bash
  pnpm lint:check
  ```

- Fix linting issues:

  ```bash
  pnpm lint:fix
  ```

- Check formatting:

  ```bash
  pnpm format:check
  ```

- Fix formatting issues:

  ```bash
  pnpm format:fix
  ```

## Architecture

The project follows a layered architecture pattern with clear separation of concerns:

- **Interfaces Layer**: Defines data structures and contracts
- **Schemas Layer**: Defines database structure
- **Models Layer**: Connects schemas to MongoDB collections
- **Repositories Layer**: Handles data access operations
- **Services Layer**: Contains business logic
- **Controllers Layer**: Handles HTTP requests and responses
- **Routes Layer**: Defines API endpoints

For more details, see the [ARCHITECTURE.md](./ARCHITECTURE.md) file.
