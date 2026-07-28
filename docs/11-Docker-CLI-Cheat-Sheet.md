# Docker CLI Cheat Sheet

## Introduction

Docker provides a rich command-line interface (CLI) for building, running, debugging, and managing containers.

This cheat sheet summarizes the most commonly used Docker commands grouped by category.

> **Tip:** Run `docker <command> --help` to view all available options for any command.

---

# Docker Version & Information

Check Docker version

```bash
docker --version
```

Detailed Docker information

```bash
docker info
```

Display Docker system information

```bash
docker system df
```

---

# Working with Images

Build an image

```bash
docker build -t my-app .
```

Build without cache

```bash
docker build --no-cache -t my-app .
```

List images

```bash
docker image ls
```

Inspect an image

```bash
docker image inspect my-app
```

Remove an image

```bash
docker rmi my-app
```

Remove unused images

```bash
docker image prune
```

Pull image from Docker Hub

```bash
docker pull nginx
```

Push image to Docker Hub

```bash
docker push username/my-app:v1
```

Tag an image

```bash
docker tag my-app username/my-app:v1
```

---

# Working with Containers

Run a container

```bash
docker run nginx
```

Run in detached mode

```bash
docker run -d nginx
```

Assign a name

```bash
docker run --name my-container nginx
```

Publish a port

```bash
docker run -p 3000:3000 my-app
```

Run with environment variables

```bash
docker run -e PORT=3000 my-app
```

Run with a volume

```bash
docker run -v data:/app/data my-app
```

Run inside a custom network

```bash
docker run --network app-network my-app
```

Run interactively

```bash
docker run -it ubuntu bash
```

---

# Listing Containers

Running containers

```bash
docker ps
```

All containers

```bash
docker ps -a
```

Latest container

```bash
docker ps -l
```

---

# Container Lifecycle

Start

```bash
docker start container-name
```

Stop

```bash
docker stop container-name
```

Restart

```bash
docker restart container-name
```

Pause

```bash
docker pause container-name
```

Resume

```bash
docker unpause container-name
```

Kill immediately

```bash
docker kill container-name
```

Remove container

```bash
docker rm container-name
```

Remove all stopped containers

```bash
docker container prune
```

---

# Container Logs

View logs

```bash
docker logs container-name
```

Follow logs

```bash
docker logs -f container-name
```

Last 100 lines

```bash
docker logs --tail 100 container-name
```

---

# Execute Commands Inside Containers

Open Bash

```bash
docker exec -it container-name bash
```

Open Shell

```bash
docker exec -it container-name sh
```

Execute a single command

```bash
docker exec container-name ls
```

---

# Copy Files

Host → Container

```bash
docker cp file.txt container:/app
```

Container → Host

```bash
docker cp container:/app/file.txt .
```

---

# Inspecting Docker Objects

Inspect container

```bash
docker inspect container-name
```

Inspect image

```bash
docker inspect image-name
```

Inspect network

```bash
docker network inspect bridge
```

Inspect volume

```bash
docker volume inspect mongo-data
```

---

# Docker Networks

List networks

```bash
docker network ls
```

Create network

```bash
docker network create app-network
```

Remove network

```bash
docker network rm app-network
```

Connect container

```bash
docker network connect app-network container
```

Disconnect container

```bash
docker network disconnect app-network container
```

Inspect network

```bash
docker network inspect app-network
```

---

# Docker Volumes

List volumes

```bash
docker volume ls
```

Create volume

```bash
docker volume create mongo-data
```

Inspect volume

```bash
docker volume inspect mongo-data
```

Delete volume

```bash
docker volume rm mongo-data
```

Delete unused volumes

```bash
docker volume prune
```

---

# Docker Compose

Start services

```bash
docker compose up
```

Start in background

```bash
docker compose up -d
```

Rebuild images

```bash
docker compose up --build
```

Stop services

```bash
docker compose stop
```

Stop and remove containers

```bash
docker compose down
```

Remove containers and volumes

```bash
docker compose down -v
```

View logs

```bash
docker compose logs
```

Follow logs

```bash
docker compose logs -f
```

List services

```bash
docker compose ps
```

Execute command

```bash
docker compose exec app bash
```

---

# Cleaning Docker

Remove unused containers

```bash
docker container prune
```

Remove unused images

```bash
docker image prune
```

Remove unused volumes

```bash
docker volume prune
```

Remove unused networks

```bash
docker network prune
```

Remove everything unused

```bash
docker system prune
```

Remove everything including volumes

```bash
docker system prune -a --volumes
```

---

# Resource Monitoring

Running containers

```bash
docker ps
```

Live resource usage

```bash
docker stats
```

Inspect container

```bash
docker inspect container-name
```

---

# Useful Flags

| Flag | Meaning |
|------|---------|
| `-d` | Detached mode |
| `-it` | Interactive terminal |
| `-p` | Publish ports |
| `-v` | Mount volume |
| `-e` | Environment variable |
| `--name` | Assign container name |
| `--network` | Attach network |
| `--rm` | Automatically remove container after exit |
| `--build` | Force image rebuild (Compose) |
| `--no-cache` | Ignore build cache |

---

# Common Debugging Commands

View logs

```bash
docker logs container
```

Open terminal

```bash
docker exec -it container bash
```

Inspect networking

```bash
docker network inspect bridge
```

Inspect container

```bash
docker inspect container
```

View running processes

```bash
docker top container
```

Live resource usage

```bash
docker stats
```

---

# Common Workflows

## Build → Run

```bash
docker build -t my-app .

docker run -p 3000:3000 my-app
```

---

## Compose Workflow

```bash
docker compose up --build

docker compose ps

docker compose logs -f

docker compose down
```

---

## Debug Workflow

```bash
docker ps

docker logs container

docker exec -it container bash

docker inspect container
```

---

# Command Categories

| Category | Command Prefix |
|-----------|----------------|
| Images | `docker image` |
| Containers | `docker container` |
| Networks | `docker network` |
| Volumes | `docker volume` |
| Compose | `docker compose` |
| System | `docker system` |

---

# Summary

The Docker CLI is the primary interface for interacting with Docker.

Although Docker provides hundreds of commands and options, most day-to-day development revolves around a small set of operations:

- Build images
- Run containers
- View logs
- Execute commands inside containers
- Manage networks
- Manage volumes
- Use Docker Compose
- Clean unused resources

Mastering these commands is enough to confidently work on most Docker-based development projects.