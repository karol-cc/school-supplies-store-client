import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./AdminCategories.css";
import BackButton from "../../components/BackButton";
import { logout, resetLogoutFlag } from "../../redux/slices/userSlice";
import {
  fetchCategories,
  createCategory,
} from "../../redux/slices/categorySlice";

const AdminCategories = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    items: categories,
    loading,
    error,
  } = useSelector((state) => state.categories);

  const { token, user } = useSelector((state) => state.user);
  const userState = useSelector((state) => state.user);

  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState("");
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

    dispatch(fetchCategories());
    setUserChecked(true);
  }, [token, user, navigate, dispatch, userState?.isLoggingOut]);

  if (!userChecked) {
    return <div className="loading">Verificando permisos...</div>;
  }

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setMessage("");

    const res = await dispatch(createCategory(categoryName));
    if (res.error) {
      setMessage("❌ Error al crear categoría");
    } else {
      setMessage("✅ Categoría creada exitosamente!");
      setCategoryName("");
    }
  };

  return (
    <div className="admin-categories">
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        <BackButton destino="/admin" texto="Volver al Panel" />
        <h1 className="admin-title"> Gestión de Categorías</h1>
      </div>
      {error && <div className="error-message">{"Categoría ya existente"}</div>}

      <form onSubmit={handleCreateCategory} className="category-form">
        <input
          type="text"
          placeholder="Nombre de la nueva categoría"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="category-input"
          required
        />

        <button type="submit" className="create-button">
          Crear Categoría
        </button>
      </form>

      <div className="view-all-container">
        <button
          className="view-all-btn"
          onClick={() => dispatch(fetchCategories())}
        >
          Ver todas las categorías
        </button>
      </div>

      {loading && <div className="loading">Cargando categorías...</div>}

      {message && (
        <div className={message.includes("✅") ? "success" : "error"}>
          {message}
        </div>
      )}

      <div className="categories-grid">
        {!loading && categories.length === 0 ? (
          <div className="no-data">No hay categorías registradas</div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="category-card">
              <div className="category-header">
                <h3 className="category-name">{cat.name}</h3>
                <span className="category-id">ID: {cat.id}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
