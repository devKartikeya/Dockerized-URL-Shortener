# Docker Introduction

## What is Docker?

Docker is an open-source containerization platform that packages an application together with its runtime, dependencies, libraries, configurations, and required system tools into a single portable unit called a **container**.

Because everything required to execute the application is packaged together, the application behaves consistently across different environments, regardless of the operating system or software installed on the host machine.

In simple words,

> **Docker allows developers to build once and run anywhere.**

---

## Why Docker Was Created

Before Docker became popular, software development suffered from a very common problem:

> **"It works on my machine."**

Consider the following scenario.

A developer builds a Node.js application on their local computer.

```
Node.js 22
Express 5
MongoDB Driver
Linux
```

The application works perfectly.

The code is then shared with another developer.

```
Node.js 20
Different npm packages
Windows
```

Suddenly the application crashes.

Sometimes the issue is caused by

- Different Node.js versions
- Missing dependencies
- Operating system differences
- Environment variables
- Different package versions

Although the source code is identical, the execution environment is not.

Docker solves this problem by packaging the **entire runtime environment**, not just the source code.

```
Application

+

Runtime

+

Dependencies

+

Configuration

↓

Docker Image

↓

Docker Container

↓

Runs Identically Everywhere
```

---

## What Does Docker Package?

A Docker container generally includes everything required to execute an application.

```
Application Source Code

+

Programming Runtime
(Node.js, Python, Java, PHP...)

+

Dependencies
(node_modules, libraries...)

+

System Packages

+

Configuration

↓

Container
```

Because of this, the application no longer depends on software installed on the host machine.

The only major dependency Docker has on the host is the **operating system kernel**.

---

## Why Docker Is Lightweight

Docker containers are often compared with Virtual Machines because both provide isolated environments.

However, their internal architecture is very different.

### Virtual Machine

```
Application

↓

Guest Operating System

↓

Guest Kernel

↓

Hypervisor

↓

Host Operating System

↓

Hardware
```

Every virtual machine contains an entire operating system.

This makes virtual machines

- Large
- Slow to boot
- Resource intensive

---

### Docker Container

```
Application

↓

Runtime

↓

Libraries

↓

Docker Engine

↓

Host Linux Kernel

↓

Hardware
```

Containers **share the host machine's kernel** instead of running their own operating system.

This makes containers

- Lightweight
- Fast
- Portable
- Memory efficient

---

## Docker on Windows and macOS

Docker Engine is designed around several Linux kernel features, including

- Namespaces
- cgroups
- OverlayFS
- chroot

Linux machines already provide these features.

Therefore,

```
Linux

↓

Install Docker Engine

↓

Ready
```

Windows and macOS do not provide the Linux kernel directly.

Therefore Docker Desktop creates a lightweight Linux environment internally.

```
Windows

↓

Docker Desktop

↓

WSL2

↓

Linux Kernel

↓

Docker Engine
```

This is why Windows users typically install **Docker Desktop**, while Linux users often install **Docker Engine** directly.

---

## Key Benefits of Docker

- Eliminates "Works on my machine" issues.
- Creates consistent development environments.
- Simplifies deployment.
- Isolates applications from each other.
- Supports multiple versions of the same software simultaneously.
- Makes applications portable.
- Enables modern DevOps workflows.
- Integrates seamlessly with CI/CD pipelines.
- Forms the foundation for container orchestration platforms like Kubernetes.

---

## Summary

Docker is not simply a tool for running containers.

It is an ecosystem that standardizes application packaging, distribution, and deployment by combining application code, dependencies, runtime, and configuration into portable containers.

Understanding Docker begins with understanding **why containerization exists**, because every Docker concept—images, containers, networking, volumes, and Compose—is built upon solving that single deployment problem.

---

## What's Next?

In the next chapter, we will explore the complete Docker Architecture, including

- Docker Engine
- Docker CLI
- Docker Daemon
- REST APIs
- Docker Objects
- Request lifecycle from command execution to container creation