# Docker Compose

## Introduction

Most modern applications consist of multiple services rather than a single container.

For example, our URL Shortener project requires

- Express API
- MongoDB Database

Running each container manually quickly becomes tedious.

```bash
docker network create app-network

docker volume create mongo-data

docker run ...

docker run ...
```

As the number of services grows, remembering every command becomes difficult.

Docker Compose solves this problem by allowing us to define an entire multi-container application inside a single YAML file.

```
docker-compose.yml

↓

docker compose up

↓

Entire Application Starts
```

---

# What is Docker Compose?

Docker Compose is a tool for defining and managing multi-container Docker applications.

Instead of executing multiple `docker run` commands,

we describe our application's services, networks, volumes and configuration inside

```
docker-compose.yml
```

Docker Compose reads this file and automatically creates everything required.

---

# Why Docker Compose?

Suppose our application requires

- Express API
- MongoDB
- Redis
- Nginx

Without Compose,

we must manually

- create networks
- create volumes
- start MongoDB
- start Redis
- start Express
- start Nginx

Each service requires separate commands.

Compose automates this entire workflow.

---

# Basic Structure

A minimal Compose file looks like

```yaml
services:

  app:
    build: .

  mongo:
    image: mongo
```

Everything inside the `services` section represents one container.

---

# Services

A service represents one container definition.

Example

```yaml
services:

  app:
    build: .

  mongo:
    image: mongo
```

Compose creates

```
Service

↓

Container
```

every time we execute

```bash
docker compose up
```

---

# Build vs Image

There are two common ways to define a service.

### Build

```yaml
app:

  build: .
```

Compose builds an image using the Dockerfile.

```
Dockerfile

↓

Image

↓

Container
```

---

### Image

```yaml
mongo:

  image: mongo
```

Compose pulls an existing image from Docker Hub.

```
Docker Hub

↓

Image

↓

Container
```

---

# Ports

Publishing ports works exactly the same as `docker run`.

```yaml
ports:

  - "3000:3000"
```

Meaning

```
Host

3000

↓

Container

3000
```

---

# Volumes

Volumes are declared inside a service.

```yaml
mongo:

  volumes:

    - mongo-data:/data/db
```

Compose automatically mounts

```
mongo-data

↓

/data/db
```

To declare a named volume,

```yaml
volumes:

  mongo-data:
```

Compose creates it automatically if it does not exist.

---

# Bind Mounts

Development projects often use bind mounts.

```yaml
volumes:

  - .:/app
```

Meaning

```
Current Folder

↓

Container

/app
```

Every file change becomes immediately visible inside the container.

---

# Environment Variables

Compose allows environment variables.

```yaml
environment:

  MONGO_URI: mongodb://mongo:27017/urlshortener

  PORT: 3000
```

Applications can access them using

```javascript
process.env.MONGO_URI
```

This avoids hardcoding configuration.

---

# depends_on

Some services depend on others.

Our API depends on MongoDB.

Compose supports this using

```yaml
depends_on:

  - mongo
```

This tells Compose to start the MongoDB container before starting the application container.

> **Note:** `depends_on` controls the startup order only. It does **not** guarantee that MongoDB is fully ready to accept connections. Production applications often use health checks or retry logic for this.

---

# Networks

Compose automatically creates a user-defined bridge network.

```
docker compose up

↓

Create Network

↓

Attach Every Service
```

Every service can communicate using its service name.

Example

```
mongodb://mongo:27017
```

No IP addresses are required.

---

# Docker Compose Lifecycle

```
docker compose up

↓

Read docker-compose.yml

↓

Create Network

↓

Create Volumes

↓

Build Images

↓

Start Containers

↓

Application Running
```

---

# Common Commands

Start the application

```bash
docker compose up
```

Start in detached mode

```bash
docker compose up -d
```

Stop containers

```bash
docker compose stop
```

Stop and remove containers

```bash
docker compose down
```

Rebuild images

```bash
docker compose up --build
```

View logs

```bash
docker compose logs
```

View running services

```bash
docker compose ps
```

---

# Complete Example

```yaml
services:

  app:

    build: .

    ports:

      - "3000:3000"

    depends_on:

      - mongo

    environment:

      MONGO_URI: mongodb://mongo:27017/urlshortener

  mongo:

    image: mongo

    ports:

      - "27018:27017"

    volumes:

      - mongo-data:/data/db

volumes:

  mongo-data:
```

Running

```bash
docker compose up
```

automatically

- Builds the Express image
- Pulls MongoDB
- Creates the network
- Creates the volume
- Starts both containers

No manual networking or volume creation is required.

---

# Real Project Connection

Our URL Shortener project originally required multiple manual commands.

```bash
docker network create app-network

docker volume create mongo-data

docker run ...

docker run ...
```

After introducing Docker Compose,

everything was managed through a single file.

Starting the complete application became as simple as

```bash
docker compose up
```

Compose automatically

- Built the application image
- Pulled the MongoDB image
- Created the shared bridge network
- Created the persistent MongoDB volume
- Connected both services together

This made the development workflow significantly simpler and much closer to how real-world applications are managed.

---

# Best Practices

✅ Store application configuration using environment variables.

✅ Use named volumes for persistent data.

✅ Use bind mounts only during development.

✅ Keep service names meaningful.

✅ Avoid hardcoding IP addresses.

✅ Keep the Compose file clean and readable.

---

# Common Beginner Mistakes

❌ Forgetting to declare named volumes.

❌ Using `localhost` instead of the service name.

❌ Assuming `depends_on` waits for the database to become ready.

❌ Hardcoding container IP addresses.

❌ Rebuilding images unnecessarily.

---

# Summary

Docker Compose simplifies multi-container application management by describing the entire application in a single YAML file.

It automatically creates containers, networks, and volumes while reducing repetitive Docker commands.

By using service names, shared networks, and centralized configuration, Docker Compose makes local development and deployment more reliable and easier to maintain.

---

# What's Next?

In the next chapter, we will cover Docker Best Practices.

Topics include

- Writing efficient Dockerfiles
- Reducing image size
- Multi-stage builds
- Security best practices
- Container naming
- Resource limits
- Logging
- Image versioning
- Production recommendations