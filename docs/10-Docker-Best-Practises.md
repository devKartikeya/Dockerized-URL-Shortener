# Docker Best Practices

## Introduction

Docker makes it easy to package and deploy applications, but writing a Dockerfile that simply "works" is not enough.

Poor Docker practices can lead to

- Large image sizes
- Slow build times
- Security vulnerabilities
- Difficult deployments
- Unnecessary resource consumption

Following Docker best practices helps create images that are

- Smaller
- Faster
- Secure
- Easier to maintain
- Production-ready

This chapter summarizes the practices commonly followed in real-world projects.

---

# Use Official Base Images

Always prefer official images whenever possible.

Good

```dockerfile
FROM node:22
```

```dockerfile
FROM python:3.13
```

```dockerfile
FROM nginx:latest
```

Official images are

- Maintained
- Frequently updated
- Security patched
- Well documented

Avoid using unknown images unless you trust the source.

---

# Choose Small Base Images

Large images increase

- Download time
- Storage usage
- Deployment time

Instead of

```dockerfile
FROM ubuntu
```

consider

```dockerfile
FROM node:22-alpine
```

or

```dockerfile
FROM alpine
```

when appropriate.

Smaller images usually mean

- Faster builds
- Faster deployments
- Reduced attack surface

> **Note:** Alpine images are excellent for many applications, but not every package or native dependency works seamlessly on Alpine. Choose the base image according to your application's requirements.

---

# Optimize Layer Caching

Arrange Dockerfile instructions carefully.

Good

```dockerfile
COPY package*.json .

RUN npm install

COPY . .
```

Bad

```dockerfile
COPY . .

RUN npm install
```

The optimized version allows Docker to reuse cached dependency layers.

Result

```
Smaller Changes

↓

Less Rebuilding

↓

Faster Builds
```

---

# Use .dockerignore

Docker sends the build context to the Docker daemon.

Without a `.dockerignore` file,

Docker may unnecessarily copy

- node_modules
- .git
- logs
- temporary files
- IDE configuration

Example

```
node_modules

.git

.env

coverage

npm-debug.log
```

Benefits

- Faster builds
- Smaller build context
- Better security

---

# Avoid Hardcoding Configuration

Avoid writing

```javascript
const PORT = 3000;
```

or

```javascript
const DB = "mongodb://localhost:27017";
```

Instead,

use environment variables.

```javascript
process.env.PORT

process.env.MONGO_URI
```

Benefits

- Easier deployment
- Better portability
- Improved security

---

# Never Store Secrets in Images

Never place

- API Keys
- Passwords
- Tokens
- Private Keys

inside

- Dockerfile
- Source Code
- Images

Instead,

provide them at runtime using

- Environment Variables
- Secret Management Tools

If an image is shared publicly,

every embedded secret becomes public as well.

---

# Keep Containers Stateless

Containers should focus on running applications.

Persistent data should live in

- Docker Volumes
- External Databases
- Cloud Storage

Avoid storing important data inside the writable layer.

```
Container

↓

Application

↓

Volume

↓

Persistent Data
```

This makes containers disposable and easy to recreate.

---

# Use Named Volumes for Databases

Databases should never rely on the writable layer.

Good

```
MongoDB

↓

Named Volume

↓

Persistent Data
```

Bad

```
MongoDB

↓

Writable Layer

↓

Lost After Container Removal
```

---

# One Process Per Container

A container should ideally run one primary process.

Good

```
Container

↓

Node.js API
```

Good

```
Container

↓

MongoDB
```

Avoid combining multiple unrelated services inside one container.

```
Node

+

Mongo

+

Redis

+

Nginx

↓

One Container
```

This makes debugging and scaling difficult.

---

# Use Meaningful Image Tags

Instead of

```
latest
```

prefer versioned tags.

```
url-shortener:v1

url-shortener:v2

url-shortener:v2.1
```

Versioned tags simplify

- Rollbacks
- Debugging
- Releases

---

# Reduce Image Size

Every unnecessary package increases image size.

Remove

- Temporary files
- Package caches
- Unused dependencies

Smaller images

- Download faster
- Deploy faster
- Consume less storage

---

# Run as a Non-Root User

By default,

many containers run as the `root` user.

For better security,

create a dedicated application user.

Example

```dockerfile
RUN adduser appuser

USER appuser
```

Running applications with limited privileges reduces security risks if the container is compromised.

---

# Prefer Multi-Stage Builds

Large build tools do not always need to be included in the final image.

Multi-stage builds separate

```
Build Stage

↓

Compile Application

↓

Production Stage

↓

Copy Final Output
```

This results in much smaller production images.

---

# Monitor Resource Usage

Containers can consume excessive CPU or memory if left unrestricted.

Docker allows resource limits.

Example

```bash
docker run \
--memory=512m \
--cpus=1 \
image
```

This helps protect the host system from a single container exhausting resources.

---

# Clean Up Unused Resources

Over time,

Docker accumulates

- Stopped containers
- Unused images
- Dangling volumes
- Unused networks

Useful commands

Remove stopped containers

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

Clean everything unused

```bash
docker system prune
```

Be careful before running cleanup commands in production environments.

---

# Keep Images Updated

Base images receive

- Security fixes
- Performance improvements
- Bug fixes

Rebuild images regularly to incorporate these updates.

---

# Real Project Connection

While developing our URL Shortener project, we gradually improved the Docker setup by following several best practices:

- Optimized layer caching by copying `package.json` before the application source.
- Used a user-defined bridge network so services communicated through container names instead of IP addresses.
- Stored MongoDB data inside a named volume for persistence.
- Managed both services using Docker Compose instead of multiple manual commands.
- Added a `.dockerignore` file to reduce the build context and speed up image creation.

These improvements made the project easier to build, faster to rebuild, and closer to a production-ready setup.

---

# Best Practices Checklist

| Practice | Recommended |
|-----------|-------------|
| Use official base images | ✅ |
| Optimize layer caching | ✅ |
| Use `.dockerignore` | ✅ |
| Keep images small | ✅ |
| Use environment variables | ✅ |
| Never store secrets | ✅ |
| Use named volumes | ✅ |
| One process per container | ✅ |
| Use meaningful image tags | ✅ |
| Clean unused resources | ✅ |
| Run as non-root user | ✅ |
| Prefer multi-stage builds | ✅ |

---

# Summary

Writing a working Dockerfile is only the first step.

A well-designed Docker setup should also prioritize performance, security, maintainability, and portability.

Following Docker best practices leads to smaller images, faster builds, easier deployments, and more reliable applications.

Many of these practices become increasingly important as projects grow from local development to production environments.

---

# What's Next?

In the next chapter, we will build a practical Docker CLI Cheat Sheet.

Topics include

- Image Commands
- Container Commands
- Network Commands
- Volume Commands
- Docker Compose Commands
- Cleanup Commands
- Debugging Commands