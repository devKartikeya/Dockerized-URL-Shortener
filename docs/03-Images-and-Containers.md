# Docker Images and Containers

## Introduction

Docker Images and Docker Containers are two of the most fundamental concepts in Docker.

Beginners often confuse them because both appear to represent the same application.

In reality, they serve completely different purposes.

A Docker **Image** is a blueprint, while a Docker **Container** is a running instance created from that blueprint.

Understanding this distinction is essential before learning Dockerfiles, networking, volumes, or Docker Compose.

---

# Docker Image

A Docker Image is an **immutable blueprint** that contains everything required to run an application.

An image typically includes

- Application source code
- Runtime environment
- Installed dependencies
- System libraries
- Environment configuration
- Startup command

Once an image is built, it becomes **read-only**.

```
Docker Image

├── Application Code
├── Runtime
├── Dependencies
├── Configuration
└── Startup Command
```

An image itself **does not execute code**.

It simply stores all the information required to create containers.

---

## Building an Image

Images are usually created using a Dockerfile.

```dockerfile
FROM node:22

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

CMD ["npm", "start"]
```

Build the image using

```bash
docker build -t url-shortener:v1 .
```

Docker creates an immutable image named

```
url-shortener:v1
```

This image is now stored locally inside Docker's storage.

---

# Why Are Images Immutable?

Docker Images never change after they are built.

For example,

```
Image

↓

Container

↓

Application writes files
```

The image itself is **never modified**.

Instead,

Docker creates a separate writable layer for every container.

This ensures

- Predictable deployments
- Easy rollback
- Layer sharing
- Efficient caching

Imagine an image as a DVD.

```
DVD

↓

Play Movie

↓

Movie Doesn't Change
```

No matter how many times you play the DVD, the original content never changes.

Docker Images behave similarly.

---

# Docker Container

A Docker Container is a **running instance** of a Docker Image.

When Docker creates a container,

it combines

```
Read-only Image

+

Writable Layer

↓

Container
```

The writable layer stores

- Temporary files
- Generated files
- Application logs
- Runtime changes

This layer exists only for that specific container.

---

## Creating a Container

Run

```bash
docker run url-shortener:v1
```

Docker performs the following steps.

```
Docker Image

↓

Create Writable Layer

↓

Create Container

↓

Start Process

↓

Running Container
```

Now your application is executing.

---

# One Image, Multiple Containers

One image can create any number of containers.

```
               Image

                 │

      ┌──────────┼──────────┐

      ▼          ▼          ▼

 Container 1  Container 2  Container 3
```

Every container receives

- its own filesystem
- its own writable layer
- its own process
- its own network namespace

This is one of Docker's biggest advantages.

---

# Container Isolation

Although containers are created from the same image,

they are completely isolated.

Example

Container A creates

```
notes.txt
```

Container B

cannot see that file.

Each container maintains its own writable filesystem.

```
Container A

notes.txt

────────────

Container B

(empty)
```

---

# Image Lifecycle

```
Dockerfile

↓

docker build

↓

Docker Image

↓

docker image ls

↓

docker image rm
```

Useful commands

List images

```bash
docker image ls
```

Inspect image

```bash
docker image inspect <image>
```

Remove image

```bash
docker rmi <image>
```

---

# Container Lifecycle

```
docker run

↓

Created

↓

Running

↓

Stopped

↓

Deleted
```

Useful commands

Create and run

```bash
docker run nginx
```

Running containers

```bash
docker ps
```

All containers

```bash
docker ps -a
```

Stop

```bash
docker stop <container>
```

Start

```bash
docker start <container>
```

Restart

```bash
docker restart <container>
```

Delete

```bash
docker rm <container>
```

---

# Images vs Containers

| Docker Image | Docker Container |
|--------------|------------------|
| Blueprint | Running instance |
| Read-only | Writable |
| Immutable | Mutable |
| Stores application | Executes application |
| Can create many containers | Created from one image |
| Does not run | Runs processes |

---

# Practical Example

Suppose we build our URL Shortener.

```bash
docker build -t url-shortener:v1 .
```

Docker stores

```
url-shortener:v1
```

Now we execute

```bash
docker run --name app1 url-shortener:v1
```

Docker creates

```
Container

app1
```

Running another command

```bash
docker run --name app2 url-shortener:v1
```

creates

```
app2
```

Both containers originate from the same image,

but each has

- separate writable storage
- separate process
- separate network stack

Neither affects the other.

---

# Common Beginner Mistake

Many beginners believe

```
Image

↓

Run

↓

Modify Files

↓

Image Changed
```

This is incorrect.

The correct workflow is

```
Image

↓

Container

↓

Writable Layer

↓

Changes Stored Here

↓

Image Remains Unchanged
```

This design is one of the reasons Docker is reliable and reproducible.

---

# Summary

A Docker Image is an immutable blueprint that packages an application's code, runtime, dependencies, and configuration.

A Docker Container is a live running instance of that image.

Every container receives its own writable layer while sharing the image's read-only layers.

This separation between immutable images and isolated containers forms the foundation of Docker's architecture.

---

# What's Next?

In the next chapter, we will study Dockerfiles in depth.

Topics include

- Dockerfile instructions
- FROM
- WORKDIR
- COPY
- ADD
- RUN
- CMD
- ENTRYPOINT
- ENV
- EXPOSE
- Best practices
- Layer optimization
- Common mistakes