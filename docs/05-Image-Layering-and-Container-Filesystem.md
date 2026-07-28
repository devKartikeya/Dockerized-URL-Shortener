# Image Layering and Container Filesystem

## Introduction

One of Docker's biggest strengths is its **layered filesystem**.

Unlike traditional virtual machines, Docker does not store an entire application as one large file.

Instead, every image is built as a collection of **independent read-only layers**.

This architecture makes Docker

- Faster
- Smaller
- Efficient
- Cache-friendly
- Easy to distribute

Understanding image layering is essential because it explains

- Why Docker builds are fast
- Why images are immutable
- How layer caching works
- Why multiple containers can share the same image
- Why containers have writable storage

---

# How Docker Stores Images

Suppose we have the following Dockerfile.

```dockerfile
FROM node:22

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

CMD ["npm", "start"]
```

Many beginners imagine Docker stores the image like this.

```
url-shortener-image

└── Entire Filesystem
```

This is **not** how Docker works.

Instead, Docker stores every filesystem-changing instruction as a separate layer.

```
Layer 5
Application Source Code

──────────────────────

Layer 4
node_modules

──────────────────────

Layer 3
package.json

──────────────────────

Layer 2
/app

──────────────────────

Layer 1
Node.js Base Image
```

Together, these layers form a single Docker Image.

---

# What Creates a Layer?

A general rule is

> Any Dockerfile instruction that modifies the filesystem creates a new image layer.

Examples

```dockerfile
FROM node:22

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .
```

These instructions modify the filesystem.

Metadata instructions usually do not create significant filesystem layers.

```
CMD

EXPOSE

ENV

LABEL
```

These mostly store configuration information.

---

# Why Layers Exist

Suppose Docker stored every image as one large file.

Then changing

```
app.js
```

would require rebuilding

```
Node

↓

Dependencies

↓

Application
```

every single time.

That would be extremely inefficient.

Instead,

Docker stores independent layers.

```
Node

↓

Dependencies

↓

Application
```

Now,

changing

```
Application
```

requires rebuilding only the final layer.

Everything below remains unchanged.

---

# Layer Caching

Layer caching is one of Docker's biggest performance optimizations.

Suppose we build our project.

```
docker build
```

Docker creates

```
Layer 1

✓

Layer 2

✓

Layer 3

✓

Layer 4

✓

Layer 5

✓
```

Now we modify

```
app.js
```

and build again.

Docker compares every instruction with the previous build.

```
FROM

✓ Cached

↓

WORKDIR

✓ Cached

↓

COPY package.json

✓ Cached

↓

RUN npm install

✓ Cached

↓

COPY Source Code

Changed

↓

Only Last Layer Rebuilt
```

Instead of rebuilding the complete image,

Docker reuses every unchanged layer.

This is why arranging Dockerfile instructions correctly is important.

---

# Optimizing Dockerfiles

Consider these two Dockerfiles.

### Poor Dockerfile

```dockerfile
COPY . .

RUN npm install
```

Whenever any source file changes,

Docker invalidates

```
COPY

↓

RUN npm install
```

and installs dependencies again.

---

### Optimized Dockerfile

```dockerfile
COPY package*.json .

RUN npm install

COPY . .
```

Now,

changing

```
app.js
```

does not affect

```
npm install
```

Docker reuses the dependency layer.

Builds become significantly faster.

---

# Immutable Layers

Every image layer is read-only.

```
Layer

↓

Read Only
```

Once Docker creates a layer,

it never modifies it.

If something changes,

Docker simply creates another layer.

This immutability guarantees

- Predictable builds
- Safe sharing
- Reliable deployments

---

# The Container Problem

If every layer is read-only,

how can an application

- create files
- write logs
- update databases
- generate uploads

?

Docker solves this using a **Writable Layer**.

---

# Creating a Container

When we execute

```bash
docker run url-shortener:v1
```

Docker performs

```
Read-only Image

+

Writable Layer

↓

Container
```

The writable layer sits above all image layers.

```
Writable Layer

────────────────────

Application

────────────────────

Dependencies

────────────────────

Node.js

────────────────────

Linux Base
```

Whenever the application creates or modifies a file,

Docker stores it inside the writable layer.

The original image remains unchanged.

---

# OverlayFS

Docker does not physically merge all layers into one directory.

Instead,

it uses a Linux filesystem technology called **OverlayFS**.

OverlayFS combines multiple directories and presents them as a single unified filesystem.

Internally

```
Layer 1

Layer 2

Layer 3

Layer 4

Writable Layer

↓

OverlayFS

↓

Unified Filesystem

↓

Container
```

To the running application,

everything appears as one normal filesystem.

```
/app

├── app.js

├── package.json

├── node_modules

└── uploads
```

The application has no idea that these files actually come from different layers.

---

# Copy-on-Write

Suppose the image contains

```
config.json
```

The application modifies it.

Docker does **not** edit the image layer.

Instead,

it copies the file into the writable layer.

```
Image

config.json

↓

Modify

↓

Copy

↓

Writable Layer

↓

Edit Copy
```

This behavior is called **Copy-on-Write (CoW)**.

The original image remains untouched.

---

# Container Deletion

Consider

```
Image

↓

Container

↓

Create Files

↓

Delete Container
```

What happens?

Docker removes only

```
Writable Layer
```

The image layers remain stored on disk.

Therefore,

```
docker run
```

can instantly create another container from the same image.

---

# Sharing Image Layers

Suppose we start three containers.

```
Container A

Container B

Container C
```

All of them use

```
Same Image
```

Docker stores only

```
One Copy

↓

Read-only Layers
```

Each container receives

```
Own Writable Layer
```

This significantly reduces storage usage.

---

# Practical Example

Our URL Shortener image contains

```
Node.js

↓

Express

↓

Mongoose

↓

Application
```

When we start two containers

```
docker run app1

docker run app2
```

Docker shares

```
Node.js

Express

Application
```

between both containers.

Only their writable layers differ.

This makes Docker much more memory and storage efficient than virtual machines.

---

# Summary

Docker Images are stored as multiple immutable layers rather than one large filesystem.

Docker uses OverlayFS to combine these layers into a unified filesystem.

Every container receives its own writable layer where runtime changes are stored.

This architecture enables

- Fast builds
- Layer caching
- Small images
- Shared storage
- Container isolation
- Immutable images

Image layering is one of Docker's most powerful internal optimizations and forms the foundation of Docker's storage architecture.

---

# What's Next?

In the next chapter, we will understand how Docker containers communicate with the outside world.

Topics include

- Port Publishing
- Port Mapping
- Container IP Addresses
- NAT
- Masquerading
- Incoming vs Outgoing Traffic