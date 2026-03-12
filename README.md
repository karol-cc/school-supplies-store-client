# 🛒 School Supplies Store — Frontend

Frontend web application for a school supplies e-commerce marketplace. Built with React and connected to a [REST API backend](https://github.com/karol-cc/school-supplies-store).

## 🚀 Tech Stack

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Redux](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router_v7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

## ✨ Features

- **Three user roles** — Customer, Seller, and Admin, each with their own views and permissions
- **Product browsing** — Home page with carousel, product detail pages, search and filtering
- **Shopping cart** — Add products, manage quantities, view order history
- **Checkout & payment** — Payment flow with credit card UI (`react-credit-cards-3`)
- **Seller dashboard** — Create, edit, delete products, and manage promotions/discounts
- **Admin panel** — Manage users, orders, payments, and categories
- **Auth flow** — Login and registration with JWT token management via Redux

## 📁 Project Structure

```
src/
├── components/
│   ├── navigation/     # Navbar
│   ├── products/       # ProductCard, ProductCarousel
│   └── profile/        # Role-based profile panels (User, Seller, Admin)
├── views/
│   ├── admin/          # AdminDashboard, AdminOrders, AdminUsers, AdminCategories, AdminPayments
│   ├── cliente/        # Carrito, DetalleProducto, Payment, Profile, CarritoHistorial
│   ├── seller/         # CrearProducto, EditarProducto, EditarPromocion, EliminarProducto
│   └── usuario/        # Register
├── redux/
│   ├── store.js
│   └── slices/         # productSlice, orderSlice, paymentSlice, categorySlice, userSlice
├── App.jsx             # Route definitions
└── main.jsx
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- The [backend API](https://github.com/karol-cc/school-supplies-store) running on `http://localhost:4002`

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/school-supplies-store-client.git
   cd school-supplies-store-client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`

## 🗺️ Routes

| Path                         | Role     | Description                         |
| ---------------------------- | -------- | ----------------------------------- |
| `/`                          | Public   | Home — product listing and carousel |
| `/login`                     | Public   | Login                               |
| `/register`                  | Public   | Register                            |
| `/producto/:id`              | Public   | Product detail                      |
| `/carrito`                   | Customer | Shopping cart                       |
| `/payment/:orderId`          | Customer | Checkout                            |
| `/CarritoHistorial/:orderId` | Customer | Order history                       |
| `/profile`                   | Customer | User profile                        |
| `/seller/create-product`     | Seller   | Create product                      |
| `/seller/edit-product/:id`   | Seller   | Edit product                        |
| `/seller/edit-promotion/:id` | Seller   | Manage promotions                   |
| `/admin`                     | Admin    | Admin dashboard                     |
| `/admin/orders`              | Admin    | Manage orders                       |
| `/admin/users`               | Admin    | Manage users                        |
| `/admin/categories`          | Admin    | Manage categories                   |
| `/admin/payments`            | Admin    | Manage payments                     |

## 🔗 Related

- [Backend API — school-supplies-store](https://github.com/karol-cc/school-supplies-store)

---

_University project — Ingeniería de Sistemas, UADE_
