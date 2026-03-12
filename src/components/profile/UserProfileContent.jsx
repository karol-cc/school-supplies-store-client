import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import usuario from "../../assets/usuario.png";
import "./UserProfileContent.css";
import UserProfileOrders from "./UserProfileOrders";

import { fetchGetMyOrders } from "../../redux/slices/orderSlice";
import { fetchGetUsersMe } from "../../redux/slices/userSlice";

const UserProfileContent = () => {
  const dispatch = useDispatch();

  const { user, token } = useSelector((state) => state.user);
  const { items: ordersHistory, loading, error } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    if (token) {
      dispatch(fetchGetUsersMe());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (token) {
      dispatch(fetchGetMyOrders());
    }
  }, [dispatch, token]);

  if (!user) {
    return <p className="loading">Cargando usuario...</p>;
  }

  const { name, email, firstName, lastName, address, cellphone, role } = user;

  const orderedHistory = [...ordersHistory].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="user-profile-card">
      <div className="user-profile-icon">
        <img src={usuario} alt="Avatar de usuario" />
      </div>

      <div className="user-info">
        <div className="user-header">
          <p className="username">{name || "Usuario"}</p>
          <span className="role-tag">{role || "USUARIO-CLIENTE"}</span>
        </div>

        <div className="profile-data-list">
          <div className="data-item">
            <strong>Nombre Completo</strong>
            <span>
              {`${firstName || ""} ${lastName || ""}`.trim() ||
                "No especificado"}
            </span>
          </div>

          <div className="data-item">
            <strong>Email</strong>
            <span>{email || "No disponible"}</span>
          </div>

          <div className="data-item">
            <strong>Dirección</strong>
            <span>{address || "No especificado"}</span>
          </div>

          <div className="data-item">
            <strong>Celular</strong>
            <span>{cellphone || "No especificado"}</span>
          </div>
        </div>
      </div>

      <div className="history-Conteiner">
        <h3>Historial de Compras</h3>

        {loading ? (
          <p className="loading">Cargando historial...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : orderedHistory.length === 0 ? (
          <p className="no-orders">No hay carritos registrados 😔</p>
        ) : (
          <div className="orders-grid">
            {orderedHistory.map((order) => (
              <div key={order.id} className="order-card">
                <UserProfileOrders order={order} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileContent;
