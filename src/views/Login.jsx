import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/userSlice";
import "./Login.css";
import logo from "../assets/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, user, token } = useSelector((state) => state.user);

  useEffect(() => {
    if (user && token) {
      setTimeout(() => navigate("/"), 100);
    }
    if (error) {
      setLocalError("Credenciales incorrectas");
    }
  }, [user, token, error, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");
    dispatch(loginUser({ email, password }));
    setEmail("");
    setPassword("");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <img src={logo} alt="Logo" />
          <h1>SuperStudy</h1>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
              title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {localError && <p className="error-msg">{localError}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Iniciando..." : "Iniciar sesión"}
          </button>

          <p className="register-text">
            ¿No tienes cuenta? <a href="/register">Crear una nueva</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
