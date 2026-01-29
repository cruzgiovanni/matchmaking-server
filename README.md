# Matchmaking Server

Game matchmaking backend built with NestJS, TypeORM and PostgreSQL.

## Technologies

- Node.js
- NestJS 11
- TypeORM
- PostgreSQL
- Jest (testing)
- Swagger (documentation)

## Prerequisites

- Node.js 18+
- Docker and Docker Compose (for the database)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd matchmaking-server
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the project root:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=matchmaking
DATABASE_PASSWORD=matchmaking123
DATABASE_NAME=matchmaking
```

4. Start the database:

```bash
docker-compose up -d
```

## Running the Application

```bash
# development (watch mode)
npm run start:dev

# production
npm run start:prod
```

The application will be available at `http://localhost:3000`.

## API Documentation

Access Swagger documentation at:

```
http://localhost:3000/api
```

## Endpoints

### Players

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /players | Create player |
| GET | /players | List players |
| GET | /players/:id | Get player by ID |
| PUT | /players/:id | Update player |
| DELETE | /players/:id | Delete player |
| GET | /players/:id/matches | Match history |
| DELETE | /players/:id/matches | Delete match history |
| GET | /players/:id/matches/lost | List losses |

### Matches

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /matches | Create match |
| GET | /matches | List matches |
| GET | /matches/:id | Get match by ID |
| DELETE | /matches/:id | Delete match |

### Results

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /results | Create result |
| GET | /results | List results |
| GET | /results/:id | Get result by ID |
| PUT | /results/:id | Update result |
| DELETE | /results/:id | Delete result |

### Matchmaking

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /matchmaking/connect | Connect player to queue |
| DELETE | /matchmaking/disconnect | Disconnect player from queue |
| GET | /matchmaking/queue | Queue status |
| GET | /matchmaking/queue/:level | Players in queue by level |

## Tests

The project uses [Jest](https://jestjs.io/) as the testing framework, integrated with NestJS's `@nestjs/testing` module.

### Test Structure

```
src/
  modules/
    player/
      player.service.spec.ts      # PlayerService unit tests
    match/
      match.service.spec.ts       # MatchService unit tests
    result/
      result.service.spec.ts      # ResultService unit tests
    matchmaking/
      matchmaking.service.spec.ts # MatchmakingService unit tests
test/
  app.e2e-spec.ts                 # End-to-end tests
  jest-e2e.json                   # Jest E2E configuration
```

### Available Commands

```bash
# Run all unit tests
npm run test

# Run tests in watch mode (re-runs on save)
npm run test:watch

# Generate coverage report
npm run test:cov

# Run tests with debugger
npm run test:debug

# Run end-to-end tests
npm run test:e2e
```

### Test Coverage

Unit tests cover the services of each module:

| Module | Tested Scenarios |
|--------|------------------|
| Player | Creation, listing, find by ID, update, deletion, nickname conflict |
| Match | Creation, listing, find by ID, deletion |
| Result | Creation, listing, find by ID, update, deletion |
| Matchmaking | Queue connection, same-level player matching, disconnection, queue status |

### Testing Pattern

Tests follow the AAA (Arrange-Act-Assert) pattern and use mocks to isolate dependencies:

```typescript
describe('PlayerService', () => {
  let service: PlayerService;

  // Repository mock
  const mockRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    // ...
  };

  beforeEach(async () => {
    // Arrange: setup test module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        { provide: PLAYER_REPOSITORY, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
  });

  it('should create a player', async () => {
    // Arrange
    mockRepository.findByNickname.mockResolvedValue(null);
    mockRepository.create.mockResolvedValue(mockPlayer);

    // Act
    const result = await service.create({ nickname: 'Test', level: 5 });

    // Assert
    expect(result).toEqual(mockPlayer);
  });
});
```

### Running Tests with Coverage

```bash
npm run test:cov
```

The coverage report is generated in `./coverage/`. Open `coverage/lcov-report/index.html` in a browser for detailed visualization.

## Architecture

The project follows the Repository Pattern with dependency inversion (DIP):

```
Controller -> Service -> Repository Interface -> Repository Implementation
```

### Folder Structure

```
src/
  modules/
    player/
      dto/
      entities/
      repositories/
      player.controller.ts
      player.service.ts
      player.module.ts
    match/
    result/
    matchmaking/
  config/
  main.ts
  app.module.ts
```

## Scalability Notes

The current matchmaking implementation uses an in-memory queue (Map). This approach works for a single server instance but does not scale horizontally.

### Problem

With multiple server instances, each one would have its own in-memory queue. Players connected to different instances would never be matched.

### Production Solution

To support multiple instances and thousands of simultaneous players:

1. **Redis as centralized queue**: Replace the in-memory Map with Redis. All instances would access the same shared queue.

```
Scalable architecture:

[Instance 1] \
[Instance 2]  --> [Redis - Central Queue] --> Match
[Instance N] /
```

2. **Code changes**:
   - `map.set(id, player)` -> `redis.sadd('queue:level:5', playerId)`
   - `map.get(id)` -> `redis.smembers('queue:level:5')`
   - `map.delete(id)` -> `redis.srem('queue:level:5', playerId)`

3. **Additional infrastructure**:
   - Load Balancer to distribute requests across instances
   - Connection pooling for the database
   - Health checks for monitoring
