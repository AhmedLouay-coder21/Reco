# RECO: Intelligent E-Commerce Platform with Hybrid Recommendation Engine

## 👥 Group Members
- Abdelrahman Hany Farouk (SE1)  
- Ahmad Louay Mahmoud (SE1)  
- Youssef Waleed (SE1)  
- Youssef Khaled (SE1)  

---

## Project Overview

**RECO** is a full-stack intelligent e-commerce platform designed to simulate a real-world online shopping experience with a built-in **hybrid recommendation engine**.

The system solves the problem of product overload in modern e-commerce platforms by providing users with **personalized product suggestions**, while also offering a complete **end-to-end shopping flow** including a simulated payment system.

---

## Problem Statement

Modern e-commerce platforms contain massive product catalogs, which often lead to:
- Decision fatigue
- Abandoned shopping carts
- Difficulty finding relevant products

Additionally, real payment integrations are difficult to implement in academic environments.

RECO solves this by:
- Providing a **self-contained e-commerce system**
- Implementing a **mock payment gateway**
- Introducing a **data-driven recommendation engine**

---

## Project Objectives

### Core E-Commerce System
- User authentication and authorization
- Product catalog management
- Shopping cart functionality
- Order processing system

### Mock Payment System
- Simulated checkout flow
- Cart → Payment → Order confirmation
- No external payment APIs required

### Hybrid Recommendation Engine
A multi-layer recommendation system including:
- **Cold Start Strategy** → Popular products for new users
- **Content-Based Filtering** → Similar products based on category/tags
- **Collaborative Filtering** → "Users also bought" recommendations

### Scalable Architecture
- Secure REST APIs
- Clean layered backend architecture
- Documented API using Swagger

---

## Target Users

### Customers
- Browse and search products
- Manage cart and orders
- Receive personalized recommendations
- Complete simulated checkout process

### Administrators
- Manage product catalog (CRUD)
- Monitor orders
- Control inventory system

---

## 🛠️ Tech Stack

### Backend
- Java
- Spring Boot
- Spring Data JPA
- MySQL

### Frontend
- HTML5
- CSS3
- JavaScript
- Tailwind CSS
- Vite (build tool)

### Tools & Testing
- Swagger (API Documentation)
- Postman (API testing)
- JUnit (unit testing)

---

## Design Patterns Used

### Builder Pattern
Used for constructing complex objects like `Order` and `Product` using Lombok `@Builder`.

### Singleton Pattern
Ensures single instances of core services like:
- MockPaymentGateway
- RecommendationService

### Factory Pattern
Used to dynamically select recommendation strategies:
- Cold Start Strategy
- Content-Based Strategy
- Collaborative Filtering Strategy

---

## 🏛️ System Architecture

The system follows a **Layered Architecture (Controller → Service → Repository)**:

### Backend Layers
- **Controller Layer** → REST API endpoints
- **Service Layer** → Business logic
- **Repository Layer** → Database operations (JPA)
- **Entity Layer** → MySQL mappings

### Key Modules
1. **User & Security Module**
   - Authentication (JWT)
   - Role management (Admin / Customer)

2. **Catalog & Inventory Module**
   - Product & category management
   - Stock control

3. **Order & Payment Module**
   - Cart system
   - Order creation
   - Mock payment processing

4. **Recommendation Engine Module**
   - SQL-based recommendation logic
   - User behavior analysis
   - Personalized product suggestions

---

## 🔗 System Design Summary

RECO is a **decoupled full-stack system**:

- Frontend: SPA (Vite + Tailwind)
- Backend: Spring Boot REST API
- Communication: JSON over HTTP (CORS enabled)

All backend services are accessible and testable via **Swagger UI**.

---

## 📄 License

This project is developed for academic purposes as part of a software engineering course.
