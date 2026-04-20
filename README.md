# 🍔 Burger Queen - Ordering System

This project is a **React + TypeScript** web application built for a burger restaurant that needs a digital system to take and manage customer orders using tablets. The app integrates with a REST API to handle authentication, menu display and order management from waiters to the kitchen.

🔗 **Live Demo:** [Try it here](https://burger-queen-seven.vercel.app)

---

## 📋 Features

### Implemented
✅ Login page with email and password  
✅ Clear and user-friendly error messages for invalid credentials or server issues  
✅ View available menus (breakfast and lunch)  
✅ Add, remove, and update items in an order  
✅ See an order summary with total cost  
✅ Send orders to the kitchen  
✅ Orders page to view and complete orders  
✅ Tablet-friendly design  

---

## 🖥️ Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS
- **State Management:** React hooks (`useState`, `useEffect`)
- **API:** REST API (built with Python, based on client specifications)
- **Deployment:** Vercel (frontend), Render (backend)

---

## 📦 Installation

Clone this repository:

```bash
git clone https://github.com/florsalvador/burger-queen.git
cd burger-queen
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

## 🔑 Usage

The application is already integrated with the deployed API. You can test it directly from the Vercel link above.

> ⚠️ Note: The first login attempt may fail. Simply try again and it will work.

### Test Credentials

| Role   | Email            | Password |
|--------|------------------|----------|
| Admin  | admin@email.com  | 123456   |
| Chef   | chef@email.com   | 123456   |
| Waiter | waiter@email.com | 123456   |

🌐 Deployment
-------------

- **Frontend:** Deployed on Vercel
- **Backend API:** Deployed on Render
  - [Backend Repository](https://github.com/florsalvador/burger-queen-api)

