# Docker Interview Questions

## Introduction

Docker is one of the most commonly asked topics in Backend, DevOps and Cloud interviews.

Interviewers generally do not expect candidates to memorize Docker commands.

Instead, they want to evaluate whether the candidate understands

- Containerization
- Linux fundamentals
- Docker architecture
- Image lifecycle
- Networking
- Volumes
- Docker Compose
- Real-world debugging

This chapter contains some of the most frequently asked Docker interview questions, along with detailed explanations.

---

# Beginner Level

## 1. What is Docker?

Docker is a containerization platform that packages an application together with all of its dependencies, runtime, libraries and configuration into a portable unit called a **container**.

Containers allow applications to run consistently across different environments.

---

## 2. What problem does Docker solve?

Docker solves the classic

> "It works on my machine."

problem.

Instead of depending on software installed on the host machine,

the application carries everything required to run.

This eliminates environment mismatch between

- Development
- Testing
- Production

---

## 3. What is Containerization?

Containerization is the process of packaging an application together with

- Runtime
- Dependencies
- Configuration
- Libraries

into an isolated container.

The container shares the host kernel while keeping the application isolated.

---

## 4. Difference between Virtual Machine and Docker Container?

| Virtual Machine | Docker Container |
|-----------------|------------------|
| Has full OS | Shares host kernel |
| Heavy | Lightweight |
| Slow startup | Fast startup |
| More RAM usage | Less RAM usage |
| Hypervisor required | Docker Engine required |
| Better isolation | Process-level isolation |

---

## 5. What is Docker Engine?

Docker Engine is the core software responsible for creating and managing Docker objects.

It consists of

- Docker CLI
- Docker Daemon (dockerd)
- Docker REST API

---

## 6. Explain Docker Architecture.

Docker follows a Client-Server Architecture.

```
User

↓

Docker CLI

↓

REST API

↓

Docker Daemon

↓

Images
Containers
Networks
Volumes
```

The CLI sends commands to the Docker daemon, which performs the requested operation.

---

## 7. What is Docker Image?

A Docker Image is an immutable blueprint of an application.

It contains

- Source code
- Runtime
- Dependencies
- Environment

Images are used to create containers.

---

## 8. What is a Docker Container?

A Docker Container is a running instance of a Docker Image.

Images are static.

Containers are dynamic.

One image can create multiple containers.

---

## 9. Difference between Image and Container?

| Image | Container |
|--------|-----------|
| Blueprint | Running instance |
| Read-only | Writable layer added |
| Immutable | Mutable while running |
| Stored in layers | Runs application |

---

## 10. What is Dockerfile?

A Dockerfile is a text file containing instructions that Docker follows to build an image.

Example

```dockerfile
FROM node:22

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

CMD ["node","app.js"]
```

---

# Intermediate Level

## 11. Why do Docker Images have layers?

Every filesystem-changing instruction creates a new layer.

Example

```dockerfile
FROM node:22

COPY package.json .

RUN npm install

COPY . .
```

Each instruction becomes one layer.

Benefits

- Layer caching
- Shared layers
- Faster rebuilds
- Less storage usage

---

## 12. What is Layer Caching?

Docker rebuilds only the layers that changed.

Example

If only

```
app.js
```

changes,

Docker skips

```
npm install
```

because its cached layer is still valid.

---

## 13. What is the Writable Layer?

When a container starts,

Docker mounts all read-only image layers using OverlayFS.

Then Docker creates a thin writable layer.

```
Image Layers (Read Only)

↓

Writable Layer

↓

Container
```

The writable layer disappears when the container is deleted.

---

## 14. Why is Docker Storage Temporary?

Because all runtime changes are stored inside the writable layer.

Deleting the container deletes that layer.

Persistent data should therefore be stored using Docker Volumes.

---

## 15. What are Docker Volumes?

Volumes are Docker-managed storage locations.

They survive container deletion.

Mostly used for

- Databases
- Uploads
- Logs

---

## 16. Difference between Volume and Bind Mount?

| Volume | Bind Mount |
|---------|------------|
| Managed by Docker | Managed by Host |
| Best for Production | Best for Development |
| Portable | Host dependent |
| Better security | Direct filesystem access |

---

## 17. What is Port Mapping?

Containers have their own isolated network.

Port Mapping connects

```
Host Port

↓

Container Port
```

using

```bash
docker run -p 3000:3000
```

---

## 18. Why doesn't localhost work between two containers?

Because each container has its own

- localhost
- network namespace

Container A's localhost is different from Container B's localhost.

Containers communicate through

- IP addresses
- Container names (User-defined bridge)

---

## 19. Difference between Default Bridge and User-defined Bridge?

| Default Bridge | User-defined Bridge |
|----------------|---------------------|
| Created automatically | Created manually |
| DNS unavailable | DNS available |
| Use IPs | Use container names |
| Limited communication | Better isolation |

---

## 20. Why did `mongodb://localhost:27017` fail in our project?

Because

```
localhost
```

inside the Express container pointed to

the Express container itself,

not the MongoDB container.

The correct URI became

```
mongodb://mongo:27017
```

because Docker's DNS resolved

```
mongo
```

to the MongoDB container.

---

# Advanced Level

## 21. Explain OverlayFS.

OverlayFS is a Linux filesystem that merges multiple image layers into one unified filesystem.

```
Layer 1

↓

Layer 2

↓

Layer 3

↓

Unified View

↓

Writable Layer
```

Containers never directly modify image layers.

---

## 22. What happens during `docker build`?

Docker

- Reads Dockerfile
- Executes instructions one by one
- Creates image layers
- Stores metadata
- Produces an image

---

## 23. What happens during `docker run`?

Docker

- Creates writable layer
- Creates namespaces
- Applies cgroups
- Attaches network
- Mounts volumes
- Starts the container process

---

## 24. Why are containers lightweight?

Containers

- Share host kernel
- Do not boot an operating system
- Share many read-only layers

Only the application process starts.

---

## 25. What are Namespaces?

Namespaces isolate resources like

- Process IDs
- Network
- Mount points
- Hostname
- IPC
- Users

Each container gets its own isolated view.

---

## 26. What are Cgroups?

Control Groups (cgroups) limit resource usage.

They control

- CPU
- Memory
- Disk I/O
- Network usage

Example

```bash
docker run --memory=512m --cpus=1 image
```

---

## 27. What is Docker Compose?

Docker Compose manages multi-container applications using

```
docker-compose.yml
```

Instead of multiple

```bash
docker run
```

commands,

one command

```bash
docker compose up
```

starts the complete application.

---

## 28. What is `depends_on`?

`depends_on` controls startup order.

It ensures one service starts before another.

However,

it **does not guarantee** that the dependency is fully ready to accept connections.

---

## 29. Why should `.dockerignore` be used?

It reduces

- Build context
- Build time
- Image size

and prevents unnecessary files from being copied into images.

---

## 30. What are Multi-stage Builds?

Multi-stage builds separate

- Build Environment
- Production Environment

Result

- Smaller images
- Better security
- Faster deployments

---

# Practical Questions

## 31. How would you Dockerize a Node.js application?

Expected answer should mention

- Dockerfile
- Base Image
- WORKDIR
- COPY
- npm install
- EXPOSE
- CMD
- .dockerignore

---

## 32. How would you connect Node.js with MongoDB?

Create a user-defined bridge network.

Use

```
mongodb://mongo:27017/database
```

instead of localhost.

---

## 33. How would you persist MongoDB data?

Attach a named volume.

```yaml
volumes:

  mongo-data:/data/db
```

---

## 34. How would you debug a crashing container?

Typical steps:

1. Check running containers

```bash
docker ps -a
```

2. View logs

```bash
docker logs container-name
```

3. Open shell

```bash
docker exec -it container-name bash
```

4. Inspect configuration

```bash
docker inspect container-name
```

---

## 35. Explain the URL Shortener project you built.

A strong answer:

> "I built a Dockerized URL Shortener using Node.js, Express and MongoDB. The application and database ran in separate containers connected through a user-defined bridge network. MongoDB data was persisted using a named volume, and Docker Compose orchestrated both services. During development I encountered networking issues such as `ECONNREFUSED` and `ENOTFOUND`, which helped me understand Docker DNS, bridge networking and container isolation."

---

# Rapid Fire Questions

- Difference between CMD and ENTRYPOINT?
- Difference between COPY and ADD?
- Why is EXPOSE optional?
- Can one image create multiple containers?
- Can multiple containers use one image?
- What is Docker Hub?
- What is Docker Registry?
- What is the purpose of `docker exec`?
- Difference between `docker stop` and `docker kill`?
- Difference between `docker compose stop` and `docker compose down`?
- Why is `.dockerignore` important?
- Why should secrets not be stored inside Docker images?
- Why is Alpine commonly used?
- Why should images be tagged instead of always using `latest`?

---

# Interview Tips

✅ Explain concepts using diagrams whenever possible.

✅ Prefer giving practical examples instead of textbook definitions.

✅ Mention Linux concepts such as Namespaces, cgroups and OverlayFS when discussing Docker internals.

✅ If you have built projects with Docker, describe the real problems you solved (networking, persistent storage, image optimization, Docker Compose).

✅ If you don't know an answer completely, explain the parts you do know rather than staying silent.

---

# Summary

Docker interview questions often progress from basic containerization concepts to deeper discussions about Linux internals, networking, storage, image optimization and deployment.

Understanding **why Docker behaves the way it does**, rather than memorizing commands, is what distinguishes a strong candidate. Practical experience—such as debugging networking issues, using Docker Compose, and persisting data with volumes—makes interview answers more convincing and memorable.