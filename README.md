# Campus Connect

Campus Connect is a full-stack web application designed to streamline campus activities by connecting students, clubs, and administrators on a single platform. It allows users to create and manage events, register for activities, share updates, and provide feedback.

---

## 🚀 Features

- Event creation and management  
- Student event registration  
- Feedback and complaint system  
- User authentication and authorization  
- Role-based access (Admin / Student / Club)  
- Real-time updates  

---

## 🛠️ Tech Stack

Frontend:
- React (Vite)
- HTML, CSS, JavaScript

Backend:
- Node.js
- Express.js

Database:
- MongoDB

---

## 📂 Project Structure
Campus-Connect/
│
├── client/ # Frontend (React)
├── server/ # Backend (Node.js + Express)
├── .env # Environment variables
├── package.json
└── README.md

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Campus-Connect.git
cd Campus-Connect
2. Install dependencies

For frontend:

cd client
npm install

For backend:

cd server
npm install
3. Setup environment variables

Create a .env file inside the server folder and add:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
4. Run the project

Start backend:

cd server
npm run dev

Start frontend:

cd client
npm run dev
🌐 Usage
Open browser and go to:
http://localhost:5173
Register/Login
Explore events
Register for events
Submit feedback
🎯 Objective

The goal of Campus Connect is to improve communication and engagement within a campus by providing a centralized platform for managing events and interactions between students and organizations.

🤝 Contributing

Contributions are welcome! Feel free to fork the repository and submit a pull request.

📜 License

This project is for educational purposes.

---
