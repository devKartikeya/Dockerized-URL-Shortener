# Docker Architecture

## Introduction

Docker follows a **client-server architecture**.

Although developers usually interact with Docker using simple commands such as

```bash
docker build
docker run
docker ps
```

there are several components working together behind the scenes.

Understanding Docker's architecture is important because every command you execute passes through these components before creating images, containers, networks, or volumes.

---

# Docker Architecture Overview

```
                 User
                  │
                  │ docker run
                  ▼
          Docker CLI (Client)
                  │
                  │ REST API
                  ▼
      Docker Daemon (dockerd)
                  │
        ┌─────────┼─────────┐
        │         │         │
        ▼         ▼         ▼
     Images   Containers  Networks
                           Volumes
```

---

## Docker Engine

Docker Engine is the underlying platform responsible for running Docker.

It consists of three primary components.

```
Docker Engine

├── Docker CLI
├── Docker Daemon
└── Docker REST API
```

Together, these components make Docker capable of building images, creating containers, managing storage, and configuring networking.

---

# Docker CLI

The Docker CLI (Command Line Interface) is the client through which users interact with Docker.

For example,

```bash
docker build -t url-shortener .
```

or

```bash
docker run nginx
```

These commands are **not executed directly**.

Instead, the CLI converts them into REST API requests and sends them to the Docker Daemon.

Think of the CLI as a **remote control**.

It does not perform the work itself.

Its only responsibility is forwarding requests.

---

# Docker Daemon (dockerd)

The Docker Daemon is the heart of Docker.

It is a background service that continuously waits for requests coming from the Docker CLI.

```
Docker CLI

↓

REST API

↓

Docker Daemon

↓

Performs Action
```

The daemon is responsible for

- Building images
- Creating containers
- Starting containers
- Stopping containers
- Removing images
- Managing Docker networks
- Managing Docker volumes
- Pulling images from Docker Hub

Almost every Docker operation eventually reaches the daemon.

---

# Docker REST API

The Docker CLI and Docker Daemon communicate through REST APIs.

```
docker run nginx

↓

CLI

↓

POST /containers/create

↓

Daemon

↓

Container Created
```

This architecture allows applications other than the Docker CLI to control Docker.

For example

- Docker Desktop
- VS Code Docker Extension
- Jenkins
- GitHub Actions
- Custom automation scripts

All communicate with Docker through the same REST API.

---

# Docker Objects

Docker stores and manages several different objects.

The most common are

```
Docker Objects

├── Images
├── Containers
├── Networks
└── Volumes
```

Each object has a specific responsibility.

### Images

Blueprints used to create containers.

### Containers

Running instances of images.

### Networks

Allow containers to communicate with each other and with the outside world.

### Volumes

Persistent storage managed by Docker.

---

# Request Lifecycle

Let's understand what happens internally when we execute

```bash
docker run hello-world
```

### Step 1

The user enters

```bash
docker run hello-world
```

---

### Step 2

The Docker CLI receives the command.

---

### Step 3

The CLI sends a REST API request to the Docker Daemon.

```
CLI

↓

REST API

↓

Daemon
```

---

### Step 4

The daemon checks whether the image exists locally.

```
hello-world

↓

Local Image?
```

If the image is not available,

Docker automatically pulls it from Docker Hub.

```
Docker Hub

↓

Image Downloaded

↓

Stored Locally
```

---

### Step 5

Docker creates a writable container layer.

```
Image

+

Writable Layer

↓

Container
```

---

### Step 6

Docker starts the container.

```
Image

↓

Container

↓

Running Process
```

---

### Step 7

The process finishes.

For the `hello-world` image,

the process simply prints a message and exits.

Therefore,

```
Running

↓

Exited (0)
```

---

# Docker Desktop

When working on Windows or macOS, developers typically install Docker Desktop.

Docker Desktop automatically installs

- Docker CLI
- Docker Engine
- Docker Compose
- Docker Credential Helper

On Windows, Docker Desktop also uses **WSL2** to provide a Linux environment capable of running Docker Engine.

```
Windows

↓

Docker Desktop

↓

WSL2

↓

Docker Engine

↓

Containers
```

---

# Summary

Docker follows a client-server architecture.

The CLI receives commands from users.

Those commands are converted into REST API requests.

The Docker Daemon performs the requested operations and manages Docker objects such as images, containers, networks, and volumes.

Understanding this architecture makes later topics—including images, networking, volumes, and Docker Compose—much easier because every Docker operation passes through the daemon.

---

# What's Next?

In the next chapter, we will understand Docker Images and Containers in depth, including

- Why images are immutable
- Difference between images and containers
- Image lifecycle
- Container lifecycle
- Read-only and writable layers
- Practical examples