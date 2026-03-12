import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/userSlice";
import "./Navigation.css";
import logo from "../../assets/logo.png";
import carrito from "../../assets/carrito.png";
import usuario from "../../assets/usuario.png";
import lupa from "../../assets/lupa.png";
import { resetOrder, fetchGetActive } from "../../redux/slices/orderSlice";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const { user, token, loading } = useSelector((state) => state.user);
  const { order } = useSelector((state) => state.orders);
  const cartCount = order?.items?.length ?? 0;
  const [animate, setAnimate] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetOrder());
    navigate("/login");
  };

  const isAuthenticated = user && token;
  let userType = "guest";

  if (isAuthenticated && user?.roles?.length > 0) {
    if (user.roles.includes("ADMIN")) userType = "admin";
    else if (user.roles.includes("SELLER")) userType = "seller";
    else userType = "user";
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlSearchTerm = params.get("busqueda");
    setAnimate(true);
    const t = setTimeout(() => setAnimate(false), 350);

    if (urlSearchTerm) setSearchTerm(urlSearchTerm);
    else if (searchTerm) setSearchTerm("");

    return () => clearTimeout(t);
  }, [location.search, cartCount]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?busqueda=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate("/");
    }
  };

  const isAdminSellerRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/seller");

  useEffect(() => {
    if (!loading && user && token) {
      dispatch(fetchGetActive());
    }
  }, [user, token, loading, dispatch]);

  return (
    <nav className="navigation">
      <div className="nav-left">
        <img
          src={logo}
          alt="Logo"
          className="nav-logo"
          onClick={() => navigate("/")}
        />
        <div className="nav-links">
          <div
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
            onClick={() => navigate("/")}
          >
            HOME
          </div>
        </div>
      </div>

      <div className="nav-center">
        <form onSubmit={handleSearch} className="search-container">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-icon">
            <img src={lupa} alt="Buscar" />
          </button>
        </form>
      </div>

      <div className="nav-right">
        {isAdminSellerRoute ? (
          <div className="user-icons">
            {isAuthenticated && (
              <>
                {userType === "admin" && (
                  <div
                    className="nav-icon plus-icon"
                    onClick={() => navigate("/admin")}
                  >
                    ➕​
                  </div>
                )}
                <div
                  className="nav-icon profile-icon"
                  onClick={() => navigate("/profile")}
                >
                  <img src={usuario} alt="Usuario" />
                </div>
                <button className="nav-logout-btn" onClick={handleLogout}>
                  Salir
                </button>
              </>
            )}
          </div>
        ) : userType === "guest" ? (
          <div className="auth-buttons">
            <button
              className="nav-signup-btn"
              onClick={() => navigate("/register")}
            >
              CREAR CUENTA
            </button>
            <button
              className="nav-login-btn"
              onClick={() => navigate("/login")}
            >
              INICIAR SESIÓN
            </button>
          </div>
        ) : (
          <div className="user-icons">
            {userType === "user" && (
              <div
                className="nav-icon cart-icon"
                onClick={() => navigate("/carrito")}
              >
                <div className={`cart-badge ${animate ? "bounce" : ""}`}>
                  <div className="cart-badge-inner">
                    <span className="cart-badge-number">{cartCount}</span>
                    <span className="cart-badge-icon">
                      <img src={carrito} alt="Carrito" />
                    </span>
                  </div>
                </div>
              </div>
            )}

            {userType === "admin" && (
              <div
                className="nav-icon plus-icon"
                onClick={() => navigate("/admin")}
              >
                ➕​
              </div>
            )}

            <div
              className="nav-icon profile-icon"
              onClick={() => navigate("/profile")}
            >
              <img src={usuario} alt="Usuario" />
            </div>
            <button className="nav-logout-btn" onClick={handleLogout}>
              Salir
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
