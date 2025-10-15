# 🦷 Dental Appointment Booking System

A **full-stack web application** built with **Node.js** and **Express**, designed to streamline dental clinic operations by enabling easy management of doctors, schedules, and appointments. The application supports both **admin** and **patient** roles and provides an Arabic front-end interface for simplicity and accessibility.

---

## 🚀 Features

### 👩‍⚕️ Admin Dashboard

* Add and manage doctors with their specialties.
* Define available appointment dates and times using interactive selectors.
* Simulate booking as a patient (“تجربة ك مريض”) without leaving the admin dashboard.
* View all appointments in real-time, including simulated bookings.
* Log out securely at any time.

### 🧑‍🦰 Patient Interface

* Log in as a registered patient to view available doctors.
* Choose appointment date and time based on doctor availability.
* View time slots with clear **AM/PM (صباحًا / مساءً)** indications.
* Logout functionality included.

---

## 🧩 Tech Stack

| Layer             | Technology                                              |
| ----------------- | ------------------------------------------------------- |
| **Backend**       | Node.js, Express.js                                     |
| **Frontend**      | HTML5, CSS3, Vanilla JavaScript                         |
| **Middleware**    | CORS, Body-Parser                                       |
| **Data Handling** | In-Memory (for simplicity; can extend to MongoDB/MySQL) |

---

## ⚙️ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/<your-username>/dental_appointment_app.git
   cd dental_appointment_app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

   The app will run at **[http://localhost:3000](http://localhost:3000)**

4. Default behavior:

   * Visiting `/` redirects automatically to the login page.

---

## 🔐 Default Accounts

| Role        | Email                                       | Password   |
| ----------- | ------------------------------------------- | ---------- |
| **Admin**   | [admin@demo.com](mailto:admin@demo.com)     | admin123   |
| **Patient** | [patient@demo.com](mailto:patient@demo.com) | patient123 |

---

## 📁 Project Structure

```
dental_appointment_app/
│
├── public/
│   ├── login.html          # Login page
│   ├── admin.html          # Admin dashboard
│   ├── patient.html        # Patient booking screen
│
├── server.js               # Express server and routes
├── package.json            # Dependencies and scripts
└── README.md               # Project documentation
```

---

## 🧠 Future Improvements

* Database integration (MongoDB or SQL) for persistent storage.
* Email/SMS appointment confirmations.
* Multi-language interface toggle (Arabic/English).
* Role-based authentication with JWT.

---

## 🩺 Author

Developed by **[Abdelrahman Mohmamed,Renad Eid]**
For questions or collaboration opportunities, feel free to reach out via GitHub or email.

