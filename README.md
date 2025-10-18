# CineBook: MEVN Stack Cinema Booking and Management System
CineBook is a full-stack, comprehensive web application designed to streamline cinema operations and provide a seamless movie ticket booking experience for users. It is built using the MEVN stack (MongoDB, Express, Vue.js, Node.js) with modern styling provided by Tailwind CSS.

The platform features a secure and efficient dual-interface model: a powerful Admin Dashboard for content management and an intuitive User Interface for browsing and booking.

🛠️ Technology Stack (MEVN + Tailwind)
Technology Overview
Database: MongoDB (Mongoose)
Role: Stores movie data, showtimes, user accounts, and booking records.
Backend: Express.js / Node.js
Role: Provides RESTful API endpoints for CRUD operations and handles authentication logic.
Frontend: Vue.js (Simulated)
Role: The reactive Single Page Application (SPA) handling all UI logic and user interaction.
Styling: Tailwind CSS
Role: Utility-first CSS framework for a responsive and modern design.

✨ Key Features
This project demonstrates a complete end-to-end application flow.
⚙️ Admin Management Interface (Dashboard)
Movie CRUD: Easily Create, Read, Update, and Delete movies (e.g., Dune and Toy Story) from the catalog.
Showtime Scheduling: Link movies to specific cinema halls, dates, times, and set ticket prices.
Real-Time Seat Management: Visualizes seat availability for any showtime instantly (Green for Available, Red for Booked).
🍿 User Booking Interface
Intuitive Browsing: View "Now Showing" and "Coming Soon" movie lists.
Interactive Seat Selection: Select preferred seats on a visual map.
Complete Booking Flow: Guides the user through selecting a showtime, choosing seats, viewing the payment summary, and confirming payment.
Booking History: Users can view a complete history of their confirmed reservations.

🚀 Getting Started
Follow these steps to set up the full MEVN environment:

1. Backend Setup (Node.js/Express)
Navigate to the server directory (e.g., /server or root if using the single-folder structure):
# Install server-side dependencies (Express, Mongoose, nodemon, etc.)
npm install
# Start the backend server with nodemon for live reload
# This is the command used to run the Express API:
npx nodemon server.js

2. Frontend Setup (Vue.js)
Navigate to the client directory (e.g., /client):
# Install client-side dependencies (Vue, Vue-router, Tailwind dependencies)
npm install
# Start the Vue development server (typically on port 8080 or 5173)
# This command runs the Vite/Vue CLI development server:
npm run dev
