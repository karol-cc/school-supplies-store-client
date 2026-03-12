import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./AdminOrders.css";
import BackButton from "../../components/BackButton";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrders,
  fetchOrderById,
  fetchCompletedOrderForAdmin,
  resetOrder,
} from "../../redux/slices/orderSlice";
import { logout, resetLogoutFlag } from "../../redux/slices/userSlice";

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.orders);
  const { token, user } = useSelector((state) => state.user);
  const userState = useSelector((state) => state.user);

  const [searchType, setSearchType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const alertShown = useRef(false);

  const showAlertOnce = (msg) => {
    if (!alertShown.current) {
      alertShown.current = true;
      alert(msg);
    }
  };

  useEffect(() => {
    if (!token) {
      if (!userState?.isLoggingOut) {
        showAlertOnce("Solo los administradores tienen acceso.");
      } else {
        dispatch(resetLogoutFlag());
      }
      dispatch(logout());
      navigate("/login");
      return;
    }

    if (!user?.roles?.includes("ADMIN")) {
      showAlertOnce("Solo los administradores tienen acceso.");
      dispatch(logout());
      navigate("/");
      return;
    }

    dispatch(fetchOrders());
  }, [token, user, navigate, dispatch]);

  const handleSearchClick = () => {
    if (!searchTerm.trim()) return;

    if (searchType === "order_id") {
      dispatch(fetchOrderById({ id: searchTerm.trim() }));
    } else if (searchType === "user_completed") {
      dispatch(fetchCompletedOrderForAdmin({ user_Id: searchTerm.trim() }));
    }
  };

  const handleAllViews = () => {
    dispatch(resetOrder());
    dispatch(fetchOrders());
  };

  return (
    <div className="admin-orders">
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        <BackButton destino="/admin" texto="Volver al Panel" />
        <h1 className="admin-title">Gestión de Pedidos</h1>
      </div>

      <div className="search-section">
        <div className="search-controls">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="search-select"
          >
            <option value="" disabled>
              Elija una Opción:
            </option>
            <option value="order_id">Buscar por ID de pedido</option>
            <option value="user_completed">
              Órdenes completadas por usuario
            </option>
          </select>

          <div className="search-bar-adminorders">
            <input
              type="text"
              placeholder={
                searchType === "user_completed"
                  ? "ID del usuario..."
                  : "ID del pedido..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
              className="search-input-adminorders"
            />
            <button className="search-btn" onClick={handleSearchClick}>
              <Search size={20} />
            </button>
          </div>
        </div>

        <div className="view-all-container">
          <button className="view-all-btn" onClick={handleAllViews}>
            Ver todos los pedidos
          </button>
        </div>
      </div>

      {loading && <div className="loading">Cargando pedidos...</div>}

      <div className="orders-grid">
        {!loading && items.length === 0 ? (
          <div className="no-data">{error || "No se encontraron pedidos"}</div>
        ) : (
          items.map((order) => (
            <div key={order.id} className="order-card-admin">
              <div className="order-header-admin">
                <h3 className="order-id">Pedido #{order.id}</h3>
              </div>

              <div className="order-info-admin">
                <p>
                  <strong>ID Usuario:</strong> {order.user?.id || "Desconocido"}
                </p>
                <p>
                  <strong>Usuario:</strong> {order.user?.name || "Desconocido"}
                </p>
                <p>
                  <strong>Total:</strong> $
                  {order.total?.toLocaleString() || "0"}
                </p>
                <p>
                  <strong>Orden confirmada:</strong>{" "}
                  {order.finalOrder ? "Sí" : "No"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
