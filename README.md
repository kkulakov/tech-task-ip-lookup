# Backend Position Technical Task

## Deployed App

### [https://tech-task-ip-lookup.fly.dev/swagger](https://tech-task-ip-lookup.fly.dev/swagger)

## Task

Implement REST API that allows users to:

 - Lookup for a particular IP address info via https://ipwhois.io/ and store in to DB
 - Response with a stored lookup info from DB in case the specific IP was already searched (DB-caching)
 - Remove cached result by IP
 - Cache should be auto-removed after TTL of 60 seconds, so only the cache result would be updated each 60 seconds for the particular IP address

## Project Features

- Clean Architecture implementation
- REST API endpoints for IP info lookup
- Input parameters validation
- SQLite3 database integration
- Swagger documentation
- Docker containerization
- Unit tests
- Integration tests
- CD to fly.io

## Technologies Used

- Node.js
- TypeScript
- NestJS
- MikroORM
- SQLite3
- Docker
- Swagger/OpenAPI
- Jest

## Project setup

```bash
$ npm install
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

API docs are available at http://localhost:3000/swagger

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Environment Variables

 - `IP_WHOIS_URL` - URL address to the service to get WHOIS info (defaults to `https://ipwho.is`)
 - `RECORD_TTL_SECONDS` - TTL of records cached in the DB in seconds (defaults to `60`)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
