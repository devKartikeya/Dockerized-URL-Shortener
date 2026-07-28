# 🔗 Dockerized URL Shortener

A production-ready URL Shortener API built with **Node.js**, **Express**, **MongoDB**, **Docker**, and **Docker Compose**. The project demonstrates how to containerize a full-stack backend application, connect multiple containers through Docker networking, persist data using MongoDB, and simplify deployment with Docker Compose.

This project was built to learn Docker from the ground up while implementing a real-world backend application rather than following simple "Hello World" examples.

---

## ✨ Features

- Generate short URLs
- Redirect to the original URL
- MongoDB database integration
- Automatic click tracking
- URL validation
- Duplicate URL detection
- RESTful API architecture
- Dockerized backend
- Dockerized MongoDB
- Docker Compose support
- Container networking
- Layer-cached image builds

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Docker
- Docker Compose

---

## 📁 Project Structure

```
.
├── controllers/
├── models/
├── routes/
├── utils/
├── app.js
├── db.js
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

---

## 🚀 Running the Project

Clone the repository

```bash
git clone https://github.com/devKartikeya/Dockerized-URL-Shortener.git
cd dockerized-url-shortener
```

Start the complete application

```bash
docker compose up --build
```

The application will be available at

```
http://localhost:3000
```

MongoDB will run automatically inside another container.

---

## 📦 API Endpoints

### Create Short URL

**POST**

```
/shorten
```

Request

```json
{
    "url": "https://google.com"
}
```

Response

```json
{
    "success": true,
    "shortCode": "g6wbWL"
}
```

---

### Redirect

**GET**

```
/:shortCode
```

Example

```
http://localhost:3000/g6wbWL
```

Automatically redirects the user to the original URL.

---

## 🐳 Docker Concepts Demonstrated

- Docker Images
- Docker Containers
- Dockerfile
- Layer Caching
- Image Layering
- Overlay Filesystem
- Bind Mounts
- Container Filesystem
- Docker Networking
- MongoDB Container
- Multi-Container Applications
- Docker Compose
- Container Isolation

---

## 📖 Documentation

| Chapter | Topic |
|---------|-------|
| 01 | Docker Introduction |
| 02 | Docker Architecture |
| 03 | Images and Containers |
| 04 | Dockerfile |
| 05 | Image Layering & Container Filesystem |
| 06 | Port Publishing & NAT |
| 07 | Docker Networking |
| 08 | Volumes & Bind Mounts |
| 09 | Docker Compose |
| 10 | Docker Best Practices |
| 11 | Docker CLI Cheat Sheet |
| 12 | Frequently Asked Interview Questions |

---

## 📚 What I Learned

While building this project I gained hands-on experience with

- Writing Dockerfiles
- Creating Documentations
- Building custom Docker images
- Container lifecycle
- Docker networking
- Connecting multiple containers
- Docker Compose
- MongoDB inside containers
- Image layers and caching
- OverlayFS concepts
- Container isolation
- Practical backend deployment workflow

---

## 🎯 Future Improvements

- Custom aliases
- QR code generation
- User authentication
- Analytics dashboard
- URL expiration
- Redis caching
- Nginx reverse proxy
- CI/CD pipeline
- Cloud deployment

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome.

You are free to add suggestions to the Documentation.

Feel free to fork the repository and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.