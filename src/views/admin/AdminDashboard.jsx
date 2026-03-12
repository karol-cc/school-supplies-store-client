import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./AdminDashboard.css";
import BackButton from "../../components/BackButton";
import { logout, resetLogoutFlag } from "../../redux/slices/userSlice";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alertShown = useRef(false);
  const [userChecked, setUserChecked] = useState(false);
  const { user, token } = useSelector((state) => state.user);
  const userState = useSelector((state) => state.user);

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

    if (user?.roles && !user.roles.includes("ADMIN")) {
      showAlertOnce("Solo los administradores tienen acceso.");
      dispatch(logout());
      navigate("/");
      return;
    }

    setUserChecked(true);
  }, [token, user, navigate, dispatch, userState?.isLoggingOut]);

  if (!userChecked) {
    return <div className="loading">Verificando permisos...</div>;
  }

  const menuItems = [
    { title: "Pedidos", path: "/admin/orders", icon: "🛒" },
    { title: "Usuarios", path: "/admin/users", icon: "👥" },
    { title: "Categorías", path: "/admin/categories", icon: "📁" },
    { title: "Pagos", path: "/admin/payments", icon: "💳" },
  ];

  return (
    <div className="admin-dashboard">
      <BackButton destino="/" texto="Volver al home" />
      <h2 className="dashboard-title">PANEL PRINCIPAL DEL ADMINISTRADOR</h2>
      <p className="dashboard-subtitle">Selecciona una opción para gestionar</p>

      <div className="dashboard-grid">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="dashboard-card"
            onClick={() => navigate(item.path)}
          >
            <div className="card-icon">{item.icon}</div>
            <h3 className="card-title">{item.title}</h3>
            <div className="card-hover">Click para entrar →</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;