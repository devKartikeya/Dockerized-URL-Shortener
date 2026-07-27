# Dockerfile

## Introduction

A Docker Image is built by following a set of instructions.

These instructions are written inside a file called a **Dockerfile**.

A Dockerfile is simply a plain text file that tells Docker

- Which base image to use
- Which dependencies to install
- Which files to copy
- Which command to execute
- Which port the application uses

During the build process, Docker executes every instruction one by one and finally produces a Docker Image.

```
Dockerfile

↓

docker build

↓

Docker Image

↓

docker run

↓

Container
```

---

# Why Do We Need a Dockerfile?

Suppose we have a Node.js application.

To run it manually, we usually perform the following steps.

```
Install Node.js

↓

Install Dependencies

↓

Copy Source Code

↓

Run npm start
```

Every developer repeats these steps on their own machine.

A Dockerfile automates this entire process.

Instead of manually performing each step, Docker executes every instruction automatically while building the image.

---

# Dockerfile Syntax

Consider the Dockerfile used in our URL Shortener project.

```dockerfile
FROM node:22

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

Although it contains only a few lines, Docker performs many operations behind the scenes.

Let's understand every instruction individually.

---

# FROM

```dockerfile
FROM node:22
```

Every Docker image begins with a base image.

```
Dockerfile

↓

FROM node:22

↓

Node.js Runtime
+
Linux Filesystem
```

The base image provides the initial filesystem that our application will use.

Without a base image, Docker has nothing to build upon.

Some common examples are

```dockerfile
FROM ubuntu

FROM node:22

FROM python:3.13

FROM nginx

FROM php:8.4
```

---

# WORKDIR

```dockerfile
WORKDIR /app
```

Sets the current working directory for all subsequent instructions.

```
Container Filesystem

/

↓

/app

↓

Current Directory
```

Now every instruction like

```
COPY

RUN

CMD
```

will execute relative to

```
/app
```

If the directory does not exist,

Docker automatically creates it.

---

# COPY

```dockerfile
COPY package*.json .
```

Copies files from the host machine into the image.

```
Host Machine

package.json

↓

Docker Image

/app/package.json
```

Later,

```dockerfile
COPY . .
```

copies the remaining application source code.

```
Project Folder

↓

Docker Image

/app
```

---

# Why Copy package.json Separately?

This is one of Docker's most important optimizations.

Instead of writing

```dockerfile
COPY . .

RUN npm install
```

we write

```dockerfile
COPY package*.json .

RUN npm install

COPY . .
```

Why?

Because Docker builds images in layers.

If only

```
app.js
```

changes,

Docker can reuse the previously cached

```
npm install
```

layer.

```
package.json

↓

RUN npm install

✓ Cached

↓

COPY Source Code

Only This Layer Rebuilds
```

This significantly reduces build time.

---

# RUN

```dockerfile
RUN npm install
```

Executes a command **during image build**.

```
docker build

↓

RUN npm install

↓

Dependencies Installed

↓

Stored Inside Image
```

The result becomes part of the image.

Examples

```dockerfile
RUN npm install

RUN apt update

RUN apt install curl

RUN mkdir uploads
```

---

# EXPOSE

```dockerfile
EXPOSE 3000
```

Documents the port that the application intends to use.

It **does not publish the port**.

Many beginners think

```
EXPOSE 3000

↓

Application Accessible
```

This is incorrect.

The correct flow is

```
EXPOSE 3000

↓

Documentation Only

↓

docker run -p

↓

Port Published
```

Docker will only expose the application externally when we explicitly publish the port.

```
docker run -p 3000:3000
```

---

# CMD

```dockerfile
CMD ["npm", "start"]
```

Defines the default command executed when a container starts.

```
docker run

↓

Container Starts

↓

CMD Executes

↓

npm start
```

There can be only **one effective CMD** inside a Dockerfile.

If multiple CMD instructions exist,

the last one overrides all previous ones.

---

# Build Process

Suppose we execute

```bash
docker build -t url-shortener:v1 .
```

Docker performs

```
Read Dockerfile

↓

FROM

↓

WORKDIR

↓

COPY package.json

↓

RUN npm install

↓

COPY Source Code

↓

EXPOSE

↓

CMD

↓

Image Created
```

Each filesystem-changing instruction becomes an image layer.

---

# Image Layers Produced

For our Dockerfile,

Docker roughly creates

```
Layer 1

Node.js Base Image

↓

Layer 2

/app Directory

↓

Layer 3

package.json

↓

Layer 4

node_modules

↓

Layer 5

Application Source Code
```

The

```
CMD

EXPOSE
```

instructions store metadata.

They do not create significant filesystem changes.

---

# Common Dockerfile Instructions

| Instruction | Purpose |
|------------|---------|
| FROM | Base image |
| WORKDIR | Set working directory |
| COPY | Copy files |
| ADD | Copy files and extract archives / remote URLs |
| RUN | Execute command during build |
| CMD | Default startup command |
| ENTRYPOINT | Fixed executable |
| ENV | Define environment variables |
| EXPOSE | Document application port |
| USER | Change current user |
| ARG | Build-time variables |

---

# Best Practices

✅ Use official base images whenever possible.

✅ Copy `package.json` before application code.

✅ Keep images as small as possible.

✅ Use `.dockerignore`.

✅ Avoid installing unnecessary packages.

✅ Prefer JSON syntax for `CMD`.

```dockerfile
CMD ["node", "app.js"]
```

instead of

```dockerfile
CMD node app.js
```

---

# Common Beginner Mistakes

❌ Copying the entire project before installing dependencies.

❌ Running `npm install` every build.

❌ Forgetting `.dockerignore`.

❌ Assuming `EXPOSE` publishes ports.

❌ Storing secrets inside the Dockerfile.

---

# Summary

A Dockerfile is a blueprint that defines how Docker should build an image.

Each instruction executes sequentially during the build process, producing image layers that Docker can cache and reuse.

Writing efficient Dockerfiles results in

- Smaller images
- Faster builds
- Better caching
- Easier deployments

Understanding Dockerfiles is essential because every Docker image begins with one.

---

# What's Next?

In the next chapter, we will explore one of Docker's most powerful features:

- Image Layering
- Layer Cache
- OverlayFS
- Writable Layer
- Container Filesystem
- Copy-on-Write
- Internal Storage Architecture

This chapter will explain what actually happens inside Docker after an image is built.