# ⭐ Store Rating App

A full-stack web application enabling users to rate registered stores on a platform with role-based access control. Built using React, Express.js, and MySQL, the app supports three user roles: **System Administrator**, **Normal User**, and **Store Owner** — each with unique functionalities.

 admin@adminportal.com , Admin@123, user-priyanka.acharya@gmail.com , User#456,owner-neha.kulkarni@storehub.in, Owner$789

---

## 🧰 Tech Stack

| Layer       | Technology       |
|-------------|------------------|
| Frontend    | React.js         |
| Backend     | Express.js       |
| Database    | MySQL            |
| Auth        | bcryptjs, JWT    |
| HTTP Client | fetch (native)   |
| Styling     | Custom CSS       |
| Deployment  | Vercel / Render  |

---

## 🚀 Features

### 🛡️ System Administrator
- Add normal users, store owners, and new stores
- Dashboard displaying total users, stores, ratings
- View/filter users and stores by name, email, address, and role
- View store ratings and individual user details
- Logout

### 👤 Normal User
- Register and log in
- Update password
- View all stores
- Search stores by name or address
- Submit or modify ratings (1–5)
- Logout

### 🏪 Store Owner
- Login and password update
- View users who rated their store
- View average store rating
- Logout

---

## 📦 Setup Instructions

### 1. Clone the Project

```bash
git clone https://github.com/kirangitacc/store-rating-app.git
cd store-rating-app
