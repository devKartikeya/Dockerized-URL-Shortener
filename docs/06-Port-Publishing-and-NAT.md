# Port Publishing and NAT

## Introduction

By default, Docker containers are completely isolated from the host machine.

Even if an application inside a container is listening on a port, that port is **not automatically accessible** from the host or the internet.

To make a container accessible from outside, Docker provides a mechanism called **Port Publishing** (also known as **Port Mapping**).

Understanding port publishing is important because almost every web application requires incoming traffic from users.

---

# Why Port Publishing Is Needed

Suppose we start an Express application inside a container.

```bash
docker run url-shortener:v1
```

The Express application starts successfully.

```
Express

↓

Listening on Port 3000
```

However,

```
Browser

↓

localhost:3000

↓

Connection Refused
```

Why?

Because the application is listening **inside the container**, not on the host machine.

```
Host Machine

──────────────

Container

Port 3000
```

The host has no idea that a service exists inside the container.

---

# Every Container Has Its Own Network

Every Docker container receives

- Its own network namespace
- Its own IP Address
- Its own localhost
- Its own ports

For example,

```
Container A

localhost:3000
```

is completely different from

```
Host Machine

localhost:3000
```

Although both use the same port number,

they belong to different network namespaces.

---

# What Is Port Publishing?

Port Publishing creates a bridge between a host port and a container port.

```
Host Port

↓

Docker

↓

Container Port
```

This allows incoming requests reaching the host machine to be forwarded into the container.

---

# Publishing a Port

Example

```bash
docker run -p 3000:3000 url-shortener:v1
```

Docker interprets this as

```
Host Port

3000

↓

Container Port

3000
```

Now,

```
Browser

↓

localhost:3000

↓

Docker

↓

Container

↓

Express Application
```

The application becomes accessible.

---

# Port Mapping Syntax

General syntax

```bash
docker run -p HOST_PORT:CONTAINER_PORT IMAGE
```

Example

```bash
docker run -p 8080:3000 url-shortener:v1
```

means

```
Host

8080

↓

Container

3000
```

The application still listens on

```
3000
```

inside the container,

but users access

```
localhost:8080
```

---

# Multiple Containers

Suppose we run two containers.

```
Container A

Port 3000
```

```
Container B

Port 3000
```

Both containers may use port

```
3000
```

internally.

However,

the host cannot bind

```
localhost:3000
```

twice.

Instead,

```
Host

3000

↓

Container A

3000
```

```
Host

3001

↓

Container B

3000
```

Example

```bash
docker run -p 3000:3000 app1

docker run -p 3001:3000 app2
```

---

# EXPOSE vs Port Publishing

Many beginners think

```dockerfile
EXPOSE 3000
```

automatically makes the application accessible.

This is incorrect.

`EXPOSE` only documents the intended application port.

It does **not** publish the port.

To actually access the application,

we must execute

```bash
docker run -p 3000:3000 image
```

---

# Incoming Traffic

Suppose a browser requests

```
http://localhost:3000
```

The request follows

```
Browser

↓

Host Port 3000

↓

Docker Engine

↓

Container Port 3000

↓

Express Application
```

Docker automatically forwards the request.

---

# Outgoing Traffic

Containers can also make outgoing requests.

For example,

our application may connect to

- MongoDB Atlas
- GitHub API
- OpenAI API
- Google

When a container sends an outgoing request,

Docker performs **Network Address Translation (NAT)**.

```
Container

172.x.x.x

↓

Docker

↓

Host Public IP

↓

Internet
```

The remote server never sees the container's private IP.

Instead,

it only sees the host machine.

---

# Masquerading

Docker implements outgoing NAT using **IP Masquerading**.

Imagine

```
Container

172.17.0.2
```

requests

```
https://google.com
```

Docker replaces

```
172.17.0.2
```

with

```
Host Public IP
```

before sending the request.

```
Container

↓

Docker NAT

↓

Host Public IP

↓

Internet
```

When the response returns,

Docker automatically delivers it back to the correct container.

This entire process is transparent to the application.

---

# Why NAT Is Important

Without NAT,

every container would require

- Its own public IP
- Manual routing
- Internet configuration

Docker eliminates this complexity.

Every container simply communicates through the host.

---

# Practical Example

Our URL Shortener API runs inside a container.

```
Container

Express

↓

Port 3000
```

We publish the port using

```bash
docker run -p 3000:3000 url-shortener:v1
```

Now,

```
Postman

↓

localhost:3000/url/shorten

↓

Docker

↓

Container

↓

Express

↓

MongoDB
```

The application behaves exactly as if it were running directly on the host machine.

---

# Common Beginner Mistakes

❌ Assuming containers automatically expose ports.

❌ Believing `EXPOSE` publishes ports.

❌ Mapping two containers to the same host port.

❌ Confusing host ports with container ports.

❌ Assuming containers use the host's localhost.

---

# Summary

Every Docker container has its own isolated networking environment.

Port Publishing creates a connection between the host machine and the container, allowing external clients to access services running inside containers.

For outgoing traffic, Docker automatically performs Network Address Translation (NAT) using IP Masquerading, enabling containers to access the internet without requiring public IP addresses.

Together, Port Publishing and NAT make communication between containers, hosts, and external networks seamless while preserving container isolation.

---

# What's Next?

In the next chapter, we will explore Docker Networking in depth.

Topics include

- Bridge Network
- User-defined Bridge
- Host Network
- None Network
- DNS Resolution
- Container-to-Container Communication
- Why MongoDB could not connect using localhost
- Why `mongo-db` worked in Docker Compose