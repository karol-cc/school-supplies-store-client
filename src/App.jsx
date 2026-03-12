import "./App.css";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import AdminDashboard from "./views/admin/AdminDashboard";
import AdminOrders from "./views/admin/AdminOrders";
import AdminUsers from "./views/admin/AdminUsers";
import AdminCategories from "./views/admin/AdminCategories";
import AdminPayments from "./views/admin/AdminPayments";

import Register from "./views/usuario/Register";

import Payment from "./views/cliente/Payment";
import DetalleProducto from "./views/cliente/DetalleProducto";
import Carrito from "./views/cliente/Carrito";
import Profile from "./views/cliente/Profile";
import CarritoHistorial from "./views/cliente/CarritoHistorial";

import CrearProducto from "./views/seller/CrearProducto";
import EditProducto from "./views/seller/EditarProducto";
import EditarPromocion from "./views/seller/EditarPromocion";
import EliminarProducto from "./views/seller/EliminarProducto";

import UserProfileContent from "./components/profile/UserProfileContent";

import Home from "./views/Home";
import Login from "./views/Login";

import Navigation from "./components/navigation/Navigation";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <Navigation />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Panel cliente */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/payment/:orderId" element={<Payment />} />
        <Route
          path="/CarritoHistorial/:orderId"
          element={<CarritoHistorial />}
        />
        <Route path="/profile/content" element={<UserProfileContent />} />

        {/* Panel admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/payments" element={<AdminPayments />} />

        {/*Rutas vendedor*/}
        <Route path="/seller/create-product" element={<CrearProducto />} />
        <Route path="/seller/edit-product/:id" element={<EditProducto />} />
        <Route
          path="/seller/edit-promotion/:id"
          element={<EditarPromocion />}
        />
        <Route
          path="/seller/delete-product/:id"
          element={<EliminarProducto />}
        />
      </Routes>
    </>
  );
}

export default App;
