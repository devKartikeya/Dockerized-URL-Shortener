# Docker Networking

## Introduction

Containers are designed to be isolated from one another.

This isolation improves security and prevents applications from interfering with each other.

However, modern applications rarely consist of a single container.

For example, our URL Shortener project contains

- Express API
- MongoDB Database

Both applications run inside separate containers but still need to communicate.

Docker solves this problem through **Docker Networks**.

---

# What is Docker Networking?

Docker Networking allows containers to communicate with

- Other containers
- The host machine
- External networks (Internet)

while maintaining container isolation.

```
                Docker Network

        ┌────────────┬────────────┐

        │                         │

        ▼                         ▼

   Express API               MongoDB

        │                         │

        └────────────┬────────────┘

                     │

               Host Machine
```

Without Docker Networks, every container would be completely isolated.

---

# Every Container Gets Its Own Network Stack

Whenever Docker starts a container, it automatically creates

- Network Namespace
- IP Address
- Network Interface
- Routing Table
- Localhost

Example

```
Container A

localhost

↓

127.0.0.1

↓

Port 3000
```

and

```
Container B

localhost

↓

127.0.0.1

↓

Port 27017
```

Although both use

```
127.0.0.1
```

they are **not the same localhost**.

Each container owns its own network namespace.

---

# Network Drivers

Docker supports multiple network drivers.

The most commonly used are

```
Docker Networks

├── Bridge
├── Host
└── None
```

Each driver has different use cases.

---

# Bridge Network

Bridge is Docker's default networking mode.

Whenever we start a container without specifying a network,

Docker automatically connects it to the default bridge.

```
docker run nginx
```

↓

```
Default Bridge
```

↓

```
Container
```

Every container receives a private IP.

Example

```
Container A

172.17.0.2
```

```
Container B

172.17.0.3
```

These IPs are reachable only inside Docker.

---

# Default Bridge Network

Docker automatically creates one bridge network when Docker Engine starts.

You can inspect it using

```bash
docker network inspect bridge
```

Output

```
bridge

↓

Containers

↓

IP Addresses
```

This is exactly what we explored while debugging our MongoDB connection.

---

# Limitation of Default Bridge

Containers inside the default bridge communicate using IP addresses.

For example

```
172.17.0.2

↓

Express
```

```
172.17.0.3

↓

MongoDB
```

Although possible,

hardcoding IP addresses is not recommended because container IPs can change.

---

# User-Defined Bridge Network

Docker allows users to create custom bridge networks.

```bash
docker network create app-network
```

Now,

```
Express

↓

app-network

↓

MongoDB
```

Containers connected to the same user-defined bridge receive two major benefits.

---

## Automatic DNS Resolution

Instead of

```
172.17.0.3
```

we can simply use

```
mongo-db
```

Example

```javascript
mongodb://mongo-db:27017/urlshortener
```

Docker automatically resolves

```
mongo-db

↓

172.x.x.x
```

using its internal DNS server.

This is one of the biggest advantages of user-defined bridge networks.

---

## Better Isolation

Containers belonging to different user-defined bridges cannot communicate unless explicitly connected.

```
Frontend Network

↓

Cannot Reach

↓

Database Network
```

This allows applications to be organized securely.

---

# Why localhost Failed

One of the most common beginner mistakes is writing

```javascript
mongodb://localhost:27017
```

inside a container.

Many developers expect

```
localhost

↓

MongoDB Container
```

However,

inside a container,

```
localhost
```

always means

```
This Container
```

not another container.

```
Express Container

localhost

↓

Express Container
```

NOT

```
MongoDB Container
```

This is exactly why our application produced

```
ECONNREFUSED
```

until both containers were connected to the same network.

---

# Why mongo-db Worked

After creating

```bash
docker network create app-network
```

we started both containers using

```bash
--network app-network
```

Now Docker's internal DNS became available.

```
Express

↓

mongo-db

↓

Docker DNS

↓

172.x.x.x

↓

MongoDB
```

No IP addresses were required.

---

# Docker Compose and Networking

Docker Compose automatically creates a user-defined bridge network.

Example

```yaml
services:

  app:

  mongo:
```

When running

```bash
docker compose up
```

Docker automatically creates

```
project_default
```

network.

Every service joins this network automatically.

Therefore,

our application could simply use

```javascript
mongodb://mongo:27017/urlshortener
```

without creating networks manually.

Compose also automatically provides DNS resolution.

---

# Inspecting Networks

List networks

```bash
docker network ls
```

Inspect a network

```bash
docker network inspect app-network
```

List connected containers

```
Network

↓

Containers

↓

IP Addresses

↓

Gateway
```

---

# Host Network

Host networking removes Docker's network isolation.

```
Container

↓

Host Network
```

The container directly uses the host machine's networking stack.

No NAT.

No bridge.

No private IP.

Advantages

- Better performance
- Lower latency

Disadvantages

- Reduced isolation
- Port conflicts
- Less secure

Host networking is commonly used on Linux for high-performance workloads.

---

# None Network

The None driver completely disables networking.

```
Container

↓

No Network
```

The container

- Cannot access the internet
- Cannot communicate with other containers
- Cannot communicate with the host

Useful for highly isolated workloads.

---

# Practical Example

Our URL Shortener architecture

```
                    app-network

        ┌──────────────────────────────┐

        │                              │

        ▼                              ▼

 Express API                    MongoDB

 Port 3000                     Port 27017

        │

        ▼

 Host Port 3000

        │

        ▼

      Browser
```

The Express container communicates with MongoDB using

```
mongo
```

while users communicate with Express through

```
localhost:3000
```

---

# Common Beginner Mistakes

❌ Using

```javascript
localhost
```

to connect to another container.

❌ Hardcoding container IP addresses.

❌ Forgetting to attach containers to the same network.

❌ Publishing MongoDB ports unnecessarily.

❌ Confusing host networking with bridge networking.

---

# Real Project Connection

During the development of our URL Shortener project, the API container initially attempted to connect to MongoDB using

```javascript
mongodb://localhost:27017
```

This resulted in a connection error because `localhost` referred to the API container itself.

After connecting both containers to the same user-defined bridge network and updating the connection string to

```javascript
mongodb://mongo-db:27017/urlshortener
```

Docker's built-in DNS automatically resolved the container name, allowing both services to communicate successfully.

Later, Docker Compose simplified this even further by automatically creating a shared network for all services.

---

# Summary

Docker Networking enables isolated containers to communicate safely with each other, the host machine, and external networks.

The Bridge driver is the default and most commonly used networking mode.

User-defined bridge networks add automatic DNS resolution and better isolation, making them the preferred choice for multi-container applications.

Docker Compose builds on this by automatically creating a shared network, allowing services to communicate using their service names instead of IP addresses.

Understanding Docker Networking is essential for building scalable multi-container applications.

---

# What's Next?

In the next chapter, we will explore Docker Volumes and Bind Mounts.

Topics include

- Why container data disappears
- Writable Layer limitations
- Docker Volumes
- Bind Mounts
- Named vs Anonymous Volumes
- Volume Lifecycle
- Best Practices
- Real-world examples