import { useState, useEffect, useRef } from "react";
import { DateRange } from "react-date-range";
import { es } from "date-fns/locale";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./AdminPayments.css";
import BackButton from "../../components/BackButton";
import { logout, resetLogoutFlag } from "../../redux/slices/userSlice";

import {
  fetchPayments,
  fetchPaymentById,
  fetchPaymentsByOrderId,
  fetchPaymentsByStatus,
  fetchPaymentsByDateRange,
  fetchPaymentsGreaterThan,
} from "../../redux/slices/paymentSlice";

const AdminPayments = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    items: filteredPayments,
    loading,
    error,
  } = useSelector((state) => state.payments);
  const { token, user } = useSelector((state) => state.user);
  const userState = useSelector((state) => state.user);

  const [searchType, setSearchType] = useState("order_id");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [dateRange, setDateRange] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);
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

    dispatch(fetchPayments());
    setUserChecked(true);
  }, [token, user, navigate, dispatch, userState?.isLoggingOut]);

  if (!userChecked) {
    return <div className="loading">Verificando permisos...</div>;
  }

  const handleSearchClick = () => {
    setShowDatePicker(false);

    if (
      !searchTerm.trim() &&
      ["id", "order_id", "monto_mayor"].includes(searchType)
    ) {
      alert("Por favor, ingresa un valor antes de buscar.");
      return;
    }

    switch (searchType) {
      case "id":
        dispatch(fetchPaymentById({ id: searchTerm.trim() }));
        break;

      case "order_id":
        dispatch(fetchPaymentsByOrderId(searchTerm.trim()));
        break;

      case "estado":
        if (selectedState) dispatch(fetchPaymentsByStatus(selectedState));
        break;

      case "monto_mayor":
        dispatch(fetchPaymentsGreaterThan(searchTerm.trim()));
        break;

      case "fechas":
        const start = dateRange[0].startDate.toISOString().split("T")[0];
        const end = dateRange[0].endDate.toISOString().split("T")[0];
        dispatch(fetchPaymentsByDateRange({ startDate: start, endDate: end }));
        break;

      default:
        dispatch(fetchPayments());
    }
  };

  const paymentsArray = Array.isArray(filteredPayments)
    ? filteredPayments
    : filteredPayments
    ? [filteredPayments]
    : [];

  return (
    <div className="admin-payments">
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        <BackButton destino="/admin" texto="Volver al Panel" />
        <h1 className="admin-title">Gestión de Pagos</h1>
      </div>

      <div className="search-section">
        <div className="search-controls">
          <select
            value={searchType}
            onChange={(e) => {
              setSearchType(e.target.value);
              setSelectedState("");
              setSearchTerm("");
            }}
            className="search-select"
          >
            <option value="order_id">Buscar por ID de pedido</option>
            <option value="id">Buscar por ID de pago</option>
            <option value="estado">Filtrar por estado</option>
            <option value="fechas">Pagos entre fechas</option>
            <option value="monto_mayor">Pagos mayores a</option>
          </select>

          {searchType === "estado" && (
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="search-select"
            >
              <option value="">Seleccionar estado</option>
              <option value="COMPLETADO">COMPLETADO</option>
              <option value="PENDIENTE">PENDIENTE</option>
            </select>
          )}

          {searchType === "fechas" && (
            <div className="calendar-container">
              <button
                className="calendar-btn"
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                Seleccionar rango de fechas 📅
              </button>
              {showDatePicker && (
                <div className="calendar-popup">
                  <DateRange
                    editableDateInputs
                    onChange={(item) => setDateRange([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={dateRange}
                    locale={es}
                    rangeColors={["#ffcf40"]}
                  />
                </div>
              )}
            </div>
          )}

          {["id", "order_id", "monto_mayor"].includes(searchType) && (
            <div className="search-bar">
              <input
                type={searchType === "monto_mayor" ? "number" : "text"}
                placeholder={
                  searchType === "monto_mayor"
                    ? "Monto..."
                    : searchType === "id"
                    ? "ID del pago..."
                    : "ID del pedido..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
                className="search-input-adminpayment"
              />
              <button className="search-btn" onClick={handleSearchClick}>
                <Search size={20} />
              </button>
            </div>
          )}

          {["estado", "fechas"].includes(searchType) && (
            <button className="search-btn" onClick={handleSearchClick}>
              <Search size={20} />
            </button>
          )}
        </div>

        <div className="view-all-container">
          <button
            className="view-all-btn"
            onClick={() => dispatch(fetchPayments())}
          >
            Ver todos los pagos
          </button>
        </div>
      </div>

      {loading && <div className="loading">Cargando pagos...</div>}
      {error && <div className="error-message">{}</div>}

      <div className="payments-grid">
        {!loading && paymentsArray.length === 0 ? (
          <div className="no-data">
            {error ? error : "No se encontraron pagos"}
          </div>
        ) : (
          paymentsArray.map((payment) => (
            <div key={payment.id} className="payment-card">
              <div className="payment-header">
                <h3 className="payment-ID">Pago #{payment.id}</h3>
              </div>
              <div className="payment-info">
                <p>
                  <strong>ID:</strong> {payment.id}
                </p>
                <p>
                  <strong>ORDER_ID:</strong>{" "}
                  {payment.order?.id ?? "Sin ID asociado"}
                </p>
                <p>
                  <strong>ESTADO:</strong> {payment.paymentStatus}
                </p>
                <p>
                  <strong>MONTO:</strong> ${payment.amountPaid}
                </p>
                <p>
                  <strong>MÉTODO:</strong> {payment.paymentMethod}
                </p>
                <p>
                  <strong>FECHA:</strong> {payment.paymentDate}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPayments;
