🚀 AI Product Recommendation System

A Full-Stack AI-powered Product Recommendation Web Application built using React (Vite) and Flask (Python).

This system provides smart product recommendations using Cosine Similarity (Machine Learning) and includes Trending Products, Best Deals, Category Filtering, and Search functionality.

🌟 Features

🔍 Search Products by Name or Tag

📂 Category-Based Filtering

📈 Trending Products (Based on Rating × Reviews)

💰 Best Deals (Based on Rating/Price Ratio)

🤖 AI-Based Similar Product Recommendations

💵 Automatic USD → INR Price Conversion

📱 Responsive Modern UI

⚡ Real-Time API Integration

🧠 Recommendation Algorithm

This project uses Cosine Similarity from Scikit-learn.

Features used for similarity:

One-Hot Encoded Category

Normalized Price

Normalized Rating

The similarity matrix is precomputed for efficient recommendation retrieval.

🛠 Tech Stack
🔹 Frontend

React (Vite)

JavaScript (ES6+)

CSS (Modern Gradient UI)

Fetch API

🔹 Backend

Python

Flask

Flask-CORS

NumPy

Scikit-learn

📂 Project Structure

AI-Product-Recommendation-System-
│
├── backend/
│ └── app.py
│
├── frontend/
│ ├── src/
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── index.html
│ ├── package.json
│ └── vite.config.js
│
└── README.md

⚙️ How To Run Locally
1️⃣ Clone Repository

git clone https://github.com/Manojshetty777/AI-Product-Recommendation-System-.git

cd AI-Product-Recommendation-System-

2️⃣ Run Backend (Flask API)

cd backend
pip install flask flask-cors numpy scikit-learn
python app.py

Backend runs on:
http://localhost:5000

3️⃣ Run Frontend (React)

cd frontend
npm install
npm run dev

Frontend runs on:
http://localhost:5173

📡 API Endpoints

GET /api/products
GET /api/recommend/trending
GET /api/recommend/deals
GET /api/recommend/similar/<id>

🚀 Future Improvements

🔐 User Authentication

🛒 Add to Cart Feature

🗄 Database Integration

🌐 Deployment (Render + Vercel)

🤝 Collaborative Filtering

📊 Analytics Dashboard

👨‍💻 Author

Manoj Shetty
GitHub: https://github.com/Manojshetty777

⭐ If you like this project, give it a star on GitHub!