import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, resetLogoutFlag } from "../../redux/slices/userSlice";
import {
  fetchOrderByIdForUser,
  paymentProcess,
} from "../../redux/slices/orderSlice";
import "./Payment.css";
import BackButton from "../../components/BackButton";
import Cards from "react-credit-cards-3";
import "react-credit-cards-3/dist/es/styles-compiled.css";

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cashOption, setCashOption] = useState("");
  const alertShown = useRef(false);
  const { token, user, userState } = useSelector((state) => state.user);
  const { order, loading } = useSelector((state) => state.orders);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [focus, setFocus] = useState("");
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  const showAlertOnce = (msg) => {
    if (!alertShown.current) {
      alertShown.current = true;
      alert(msg);
    }
  };

  useEffect(() => {
    if (!token) {
      if (!userState?.isLoggingOut) {
        showAlertOnce("⚠ Solo los clientes pueden acceder al pago.");
      } else {
        dispatch(resetLogoutFlag());
      }
      dispatch(logout());
      navigate("/login");
      return;
    }

    if (!user?.roles?.includes("USER")) {
      showAlertOnce("⚠ Solo los clientes pueden acceder al pago.");
      dispatch(logout());
      navigate("/");
      return;
    }

    dispatch(fetchOrderByIdForUser({ id: orderId }));
  }, [token, user, orderId, dispatch, navigate, userState?.isLoggingOut]);

  const isCardFormValid = () =>
    /^\d{13,16}$/.test(cardNumber) &&
    /^[A-Za-z ]+$/.test(cardHolder) &&
    /^\d{2}\/\d{2}$/.test(expiry) &&
    /^\d{3,4}$/.test(cvc);

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setFieldErrors({});

    if (!order) {
      setError("Orden no cargada correctamente.");
      return;
    }

    if (!order.finalOrder) {
      setError("⚠ Primero debes confirmar la orden antes de proceder al pago.");
      return;
    }

    if (!paymentMethod) {
      setError("Seleccione un método de pago.");
      return;
    }

    const newFieldErrors = {};
    if (!fullName || !fullName.trim())
      newFieldErrors.fullName = "Este campo es obligatorio";
    if (!city || !city.trim())
      newFieldErrors.city = "Este campo es obligatorio";
    if (!postalCode || !postalCode.trim())
      newFieldErrors.postalCode = "Este campo es obligatorio";
    if (!address || !address.trim())
      newFieldErrors.address = "Este campo es obligatorio";

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      setError("⚠ Debes completar todos los datos del cliente antes de pagar.");
      return;
    }

    if (
      (paymentMethod === "TARJETA_CREDITO" ||
        paymentMethod === "TARJETA_DEBITO") &&
      !isCardFormValid()
    ) {
      setError("Complete los datos de la tarjeta correctamente.");
      return;
    }
    const newPayment = {
      paymentMethod,
    };

    dispatch(paymentProcess({ id: orderId, newPayment }))
      .unwrap()
      .then(() => {
        setMessage("✅ El pago se ha realizado con éxito.");
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          dispatch({ type: "orders/resetOrder" });
          navigate("/");
        }, 2500);
      })
      .catch((err) => setError(err.message || "Error al procesar el pago."));
  };

  if (loading || !order) {
    return (
      <div className="payment-container">
        <p>⏳ Cargando proceso de pago...</p>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <BackButton destino="/" texto=" Volver al home" className="back-button" />
      <h2>REALIZAR PAGO</h2>

      {error && <p className="error-msg">{error}</p>}
      {message && <p className="success-msg">{message}</p>}

      <form onSubmit={handleSubmit} className="payment-form">
        <div className="payment-left-column">
          {/* Datos Cliente */}
          <div className="shipping-section">
            <h3>DATOS DEL CLIENTE</h3>

            <div className="input-group">
              <input
                type="text"
                placeholder="Ingrese su nombre completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={fieldErrors.fullName ? "input-error" : ""}
              />

              {fieldErrors.fullName && (
                <p className="field-error-text">{fieldErrors.fullName}</p>
              )}
            </div>

            <div className="input-group-row">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Ciudad"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={fieldErrors.city ? "input-error" : ""}
                />
                {fieldErrors.city && (
                  <p className="field-error-text">{fieldErrors.city}</p>
                )}
              </div>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Código postal"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className={fieldErrors.postalCode ? "input-error" : ""}
                />
                {fieldErrors.postalCode && (
                  <p className="field-error-text">{fieldErrors.postalCode}</p>
                )}
              </div>
            </div>

            <div className="input-group">
              <input
                type="text"
                placeholder="Dirección completa"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={fieldErrors.address ? "input-error" : ""}
              />
              {fieldErrors.address && (
                <p className="field-error-text">{fieldErrors.address}</p>
              )}
            </div>
          </div>

          {/* Método de pago */}
          <div className="payment-section">
            <h3>MÉTODO DE PAGO</h3>

            <div className="payment-methods-container">
              <label className="label-large-black">
                Seleccionar método de pago:
              </label>

              <div className="payment-methods">
                {/* Efectivo */}
                <div
                  className={`payment-method-option ${
                    paymentMethod === "EFECTIVO" ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    id="efectivo"
                    name="paymentMethod"
                    value="EFECTIVO"
                    checked={paymentMethod === "EFECTIVO"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="efectivo">Efectivo</label>
                </div>

                <div
                  className={`payment-method-option ${
                    paymentMethod === "TARJETA_CREDITO" ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    id="credito"
                    name="paymentMethod"
                    value="TARJETA_CREDITO"
                    checked={paymentMethod === "TARJETA_CREDITO"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="credito">Tarjeta de Crédito</label>
                </div>

                <div
                  className={`payment-method-option ${
                    paymentMethod === "TARJETA_DEBITO" ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    id="debito"
                    name="paymentMethod"
                    value="TARJETA_DEBITO"
                    checked={paymentMethod === "TARJETA_DEBITO"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="debito">Tarjeta de Débito</label>
                </div>
              </div>

              {paymentMethod === "EFECTIVO" && (
                <div className="cash-options">
                  <label className="label-large-black">Efectivo</label>{" "}
                  <div className="cash-option">
                    <input
                      type="radio"
                      id="pagoFacil"
                      name="cashOption"
                      value="PAGO_FACIL"
                      checked={cashOption === "PAGO_FACIL"}
                      onChange={(e) => setCashOption(e.target.value)}
                    />
                    <label htmlFor="pagoFacil">Pago Fácil</label>
                  </div>
                  <div className="cash-option">
                    <input
                      type="radio"
                      id="rapipago"
                      name="cashOption"
                      value="RAPIPAGO"
                      checked={cashOption === "RAPIPAGO"}
                      onChange={(e) => setCashOption(e.target.value)}
                    />
                    <label htmlFor="rapipago">Rapipago</label>
                  </div>
                </div>
              )}
            </div>

            {(paymentMethod === "TARJETA_CREDITO" ||
              paymentMethod === "TARJETA_DEBITO") && (
              <div className="card-form">
                <label className="label-large-black">
                  Información de la tarjeta:
                </label>

                <div className="card-form-content">
                  <div className="card-display">
                    <Cards
                      number={cardNumber}
                      name={cardHolder}
                      expiry={expiry}
                      cvc={cvc}
                      focused={focus}
                    />
                  </div>

                  <div className="card-form-fields">
                    <input
                      type="text"
                      name="number"
                      placeholder="Número de tarjeta"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(e.target.value.replace(/\D/g, ""))
                      }
                      onFocus={(e) => setFocus(e.target.name)}
                      maxLength={16}
                    />
                    <input
                      type="text"
                      name="name"
                      placeholder="Nombre en la tarjeta"
                      value={cardHolder}
                      onChange={(e) =>
                        setCardHolder(e.target.value.replace(/[^A-Za-z ]/g, ""))
                      }
                      onFocus={(e) => setFocus(e.target.name)}
                    />
                    <input
                      type="text"
                      name="expiry"
                      placeholder="MM/AA"
                      value={expiry}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        if (val.length <= 4) {
                          let formatted = val;
                          if (val.length > 2)
                            formatted = val.slice(0, 2) + "/" + val.slice(2);
                          setExpiry(formatted);
                        }
                      }}
                      onFocus={(e) => setFocus(e.target.name)}
                      maxLength={5}
                    />
                    <input
                      type="text"
                      name="cvc"
                      placeholder="CVC"
                      value={cvc}
                      onChange={(e) =>
                        setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                      }
                      onFocus={(e) => setFocus(e.target.name)}
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="pay-btn"
              disabled={
                (paymentMethod === "TARJETA_CREDITO" ||
                  paymentMethod === "TARJETA_DEBITO") &&
                !isCardFormValid()
              }
            >
              ¡Listo, Pagar!
            </button>
          </div>
        </div>

        <div className="payment-right-column">
          <div className="order-summary-section">
            <h3>COSTO TOTAL: </h3>
            <div className="order-total">
              <span>Total:</span>
              <span>${order.total?.toFixed(2) || "0.00"}</span>
            </div>
          </div>

          <div className="rewards-section">
            <h4> ¡Atención, querido Cliente!</h4>
            <p>
              Por favor, revise cuidadosamente la siguiente información antes de
              finalizar su compra:
            </p>
            <ul>
              <li>Verifique bien su Dirección Completa y Código Postal.</li>
              <li>Confirme todos los datos de su Tarjeta de Crédito/Débito.</li>
            </ul>
            <p>
              **Al confirmar el pago, la compra es final. Por favor, asegure la
              exactitud de sus datos.**
            </p>
            <p>Gracias por elegir SuperStudy!</p>
          </div>
        </div>
      </form>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>¡Pago finalizado! 🎉</h3>
            <p>Gracias por su compra. Serás redirigido al inicio...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
