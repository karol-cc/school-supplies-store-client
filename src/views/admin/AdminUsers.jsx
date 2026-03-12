import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./AdminUsers.css";
import BackButton from "../../components/BackButton";
import { 
    fetchUserEmail,
    fetchUserId,
    fetchUsers,
    logout,
    resetLogoutFlag } from "../../redux/slices/userSlice";

const AdminUsers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token, user, isLoggingOut } = useSelector((state) => state.user);
  const userState = useSelector((state) => state.user);
  const { items: users, loading, error } = useSelector((state) => state.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("email");
  const [userChecked, setUserChecked] = useState(false);

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

    if (user?.roles && !user.roles.includes("ADMIN")) {
      showAlertOnce("Solo los administradores tienen acceso.");
      dispatch(logout());
      navigate("/");
      return;
    }

    dispatch(fetchUsers());
    setUserChecked(true);
  }, [token, user, navigate, dispatch, userState?.isLoggingOut]);

  if (!userChecked) {
    return <div className="loading">Verificando permisos...</div>;
  }

  const handleSearchClick = () => {
    if (!searchTerm.trim()) {
      dispatch(fetchUsers());
      return;
    }

    if (searchType === "email") {
      dispatch(fetchUserEmail({ email: searchTerm.trim()}));
    } else if (searchType === "id") {
      dispatch(fetchUserId({ id: searchTerm.trim()}));
    }
  };

  const getRoleLabel = (role) => {
    switch (role?.toUpperCase()) {
      case "USER":
        return "Cliente";
      case "SELLER":
        return "Vendedor";
      case "ADMIN":
        return "Administrador";
      default:
        return role || "Sin rol";
    }
  };

  const usersArray = Array.isArray(users)
    ? users
    : users
    ? [users]
    : [];

  return (
    <div className="admin-users">
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        <BackButton destino="/admin" texto="Volver al Panel" />
        <h1 className="admin-title">Gestión de Usuarios</h1>
      </div>

      <div className="search-section">
        <div className="search-controls">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="search-select"
          >
            <option value="email">Buscar por Email</option>
            <option value="id">Buscar por ID</option>
          </select>

          <div className="search-bar">
            <input
              type={searchType === "id" ? "number" : "text"}
              placeholder={searchType === "email" ? "Email..." : "ID..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
              className="search-input"
            />
            <button className="search-btn" onClick={handleSearchClick}>
              <Search size={20} />
            </button>
          </div>
        </div>

        <div className="view-all-container">
          <button
            className="view-all-btn"
            onClick={() => dispatch(fetchUsers())}
          >
            Ver todos los usuarios
          </button>
        </div>
      </div>

      {loading && <div className="loading">Cargando usuarios...</div>}
      {error && <div className="error-message"></div>}

      <div className="users-grid">
        {!loading && usersArray.length === 0 ? (
          <div className="no-data">
            {error ? error : "No se encontraron usuarios"}
          </div>
        ) : (
          usersArray.map((u, index) => (
            <div key={index} className="user-card">
              <div className="user-header">
                <h3 className="user-name">{u.name || "Usuario sin nombre"}</h3>
                <span className={`user-role ${u.role?.toLowerCase()}`}>
                  {getRoleLabel(u.role)}
                </span>
              </div>

              <div className="user-info">
                <p>
                  <strong>Nombre:</strong> {u.firstName || "—"}
                </p>
                <p>
                  <strong>Apellido:</strong> {u.lastName || "—"}
                </p>
                <p>
                  <strong>Email:</strong> {u.email || "—"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminUsers;