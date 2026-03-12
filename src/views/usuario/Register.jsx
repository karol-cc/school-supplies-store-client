import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/slices/userSlice";
import "./Register.css";

const Register = () => {
  const [role, setRole] = useState("USER");
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [address, setAddress] = useState("");

  const [localError, setLocalError] = useState("");
  const [localSuccess, setLocalSuccess] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, token } = useSelector((state) => state.user);

  useEffect(() => {
    if (token) {
      setLocalSuccess("✅ ¡Cuenta creada exitosamente!");
      setShowPopup(true);
      const timer = setTimeout(() => {
        setShowPopup(false);
        navigate("/");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [token, navigate]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
      setLocalSuccess("");
    } else if (!loading) {
      setLocalError("");
    }
  }, [error, loading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError("");
    setLocalSuccess("");

    const payload = {
      firstname: firstName,
      lastname: lastName,
      name,
      email,
      password,
      cellphone,
      address,
      role,
    };

    dispatch(registerUser(payload));

    setFirstname("");
    setLastname("");
    setName("");
    setEmail("");
    setPassword("");
    setCellphone("");
    setAddress("");
  };

  return (
    <div className={`form-container ${role}`}>
      <div className="tabs">
        <button
          className={`tab ${role === "USER" ? "active" : ""}`}
          onClick={() => setRole("USER")}
          disabled={loading}
        >
          Super Cliente
        </button>
        <button
          className={`tab ${role === "SELLER" ? "active" : ""}`}
          onClick={() => setRole("SELLER")}
          disabled={loading}
        >
          Super Vendedor
        </button>
        <div className="indicator" />
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="row">
          <input
            name="firstName"
            placeholder="Primer Nombre"
            value={firstName}
            onChange={(e) => setFirstname(e.target.value)}
            required
            disabled={loading}
          />
          <input
            name="lastName"
            placeholder="Segundo Nombre"
            value={lastName}
            onChange={(e) => setLastname(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="row">
          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="row">
          <input
            name="name"
            placeholder="Nombre de usuario"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="row">
          <input
            name="cellphone"
            placeholder="Número de teléfono"
            value={cellphone}
            onChange={(e) => setCellphone(e.target.value)}
            required
            disabled={loading}
          />
          <input
            name="address"
            placeholder="Dirección"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {(localError || error) && (
          <p className="error-msg">{localError || error}</p>
        )}
        {localSuccess && <p className="success-msg">{localSuccess}</p>}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Creando..." : "¡Crear cuenta!"}
        </button>
      </form>

      {/* 🌟 Popup animado */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>¡Registro exitoso! 🎉</h3>
            <p>Serás redirigido al inicio...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
