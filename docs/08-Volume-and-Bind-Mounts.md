# Docker Volumes and Bind Mounts

## Introduction

Every Docker container receives its own writable layer.

Whenever an application creates

- Files
- Logs
- Uploaded images
- Database records
- Cache

they are stored inside this writable layer.

However, this storage is **temporary**.

If the container is deleted, Docker also deletes its writable layer.

For applications that need long-term storage, Docker provides two mechanisms:

- Docker Volumes
- Bind Mounts

These allow data to survive even after containers are recreated.

---

# Why Container Storage Is Temporary

Consider the following workflow.

```
Docker Image

↓

Container

↓

Application Writes Data

↓

Writable Layer
```

Suppose the application stores

```
users.json
```

inside the container.

Now execute

```bash
docker rm my-container
```

The writable layer is destroyed.

```
Container Deleted

↓

Writable Layer Deleted

↓

Data Lost
```

This behavior is intentional.

Containers are designed to be **ephemeral**.

---

# The Problem

Imagine running MongoDB inside a container.

```
MongoDB

↓

Insert Records

↓

Container Deleted
```

Without persistent storage,

every document disappears.

Obviously, databases cannot work like this.

Docker therefore separates

```
Application

and

Data
```

---

# Docker Volumes

A Docker Volume is a storage location managed entirely by Docker.

Instead of storing data inside the writable layer,

Docker stores it separately on the host machine.

```
Container

↓

Volume

↓

Host Disk
```

Even if the container is deleted,

the volume remains.

---

# Creating a Volume

Create a volume

```bash
docker volume create mongo-data
```

List all volumes

```bash
docker volume ls
```

Inspect a volume

```bash
docker volume inspect mongo-data
```

Delete a volume

```bash
docker volume rm mongo-data
```

---

# Using a Volume

Attach a volume while starting a container.

```bash
docker run \
-v mongo-data:/data/db \
mongo
```

Docker mounts

```
Volume

↓

/data/db

↓

MongoDB
```

Now MongoDB stores every document inside the volume.

Deleting the container no longer deletes the data.

---

# Volume Lifecycle

```
Create Volume

↓

Attach to Container

↓

Application Uses Volume

↓

Container Deleted

↓

Volume Still Exists
```

Only deleting the volume removes the data.

---

# Anonymous Volumes

Docker can also create unnamed volumes automatically.

Example

```bash
docker run \
-v /data/db \
mongo
```

Docker creates

```
Random Volume Name

↓

Attached to Container
```

Anonymous volumes are useful for temporary storage but are difficult to manage because Docker assigns random names.

---

# Named Volumes

Named volumes are created explicitly.

Example

```bash
docker volume create uploads
```

or

```bash
-v uploads:/app/uploads
```

Named volumes are easier to

- Reuse
- Backup
- Inspect
- Share

Most production applications use named volumes.

---

# Bind Mounts

Unlike volumes,

Bind Mounts do not let Docker manage storage.

Instead,

Docker directly maps a folder from the host machine into the container.

```
Host Folder

↓

Container Folder
```

Example

```bash
docker run \
-v ./src:/app/src \
node
```

Now

```
Host

src/

↓

Container

/app/src
```

Both point to the same directory.

---

# How Bind Mounts Work

Suppose

```
Host

app.js
```

is mounted into

```
Container

/app/app.js
```

Editing

```
app.js
```

on the host immediately updates the file inside the container.

No image rebuild is required.

```
VS Code

↓

Host File

↓

Container

↓

Application
```

This is why bind mounts are extremely popular during development.

---

# Volumes vs Bind Mounts

| Docker Volumes | Bind Mounts |
|---------------|-------------|
| Managed by Docker | Managed by Host |
| Portable | Depends on host path |
| Best for databases | Best for source code |
| Easy backups | Direct file editing |
| Preferred in production | Preferred during development |

---

# Real Project Connection

While developing our URL Shortener,

every source code change originally required

```bash
docker build

↓

docker run
```

After introducing a bind mount,

the project directory on the host was directly mounted inside the container.

```
VS Code

↓

Project Folder

↓

Bind Mount

↓

Container
```

Now every code change became instantly visible to Node.js without rebuilding the image.

Later,

we also attached a named volume to MongoDB.

```
MongoDB

↓

Named Volume

↓

Persistent Data
```

Deleting the MongoDB container no longer deleted the database.

---

# Docker Compose Example

Using a named volume

```yaml
services:

  mongo:

    image: mongo

    volumes:

      - mongo-data:/data/db

volumes:

  mongo-data:
```

Using a bind mount

```yaml
services:

  app:

    build: .

    volumes:

      - .:/app
```

Compose automatically creates missing named volumes.

---

# Best Practices

✅ Use Docker Volumes for databases.

✅ Use Bind Mounts during development.

✅ Prefer named volumes over anonymous volumes.

✅ Never store important production data inside the writable layer.

✅ Back up important volumes regularly.

---

# Common Beginner Mistakes

❌ Assuming container storage is permanent.

❌ Deleting a volume accidentally.

❌ Using bind mounts for production databases.

❌ Confusing bind mounts with image layers.

❌ Believing bind mounts copy files instead of sharing them.

---

# Summary

Docker containers use a temporary writable layer that disappears when the container is removed.

Docker Volumes provide persistent storage managed by Docker and are ideal for databases and production data.

Bind Mounts directly connect host directories with container directories, making them perfect for local development because file changes appear instantly inside the container.

Choosing between volumes and bind mounts depends on whether the goal is persistent application data or live source code synchronization.

---

# What's Next?

In the next chapter, we will learn Docker Compose.

Topics include

- Why Docker Compose exists
- docker-compose.yml structure
- Services
- Networks
- Volumes
- Environment Variables
- depends_on
- Multi-container applications
- Real Project Walkthrough