import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Carrito.css";
import "./CarritoHistorial.css";
import BackButton from "../../components/BackButton";

import { fetchOrderByIdForUser } from "../../redux/slices/orderSlice";

const CarritoHistorial = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    order: orderDetails,
    loading,
    error,
  } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderByIdForUser({ id: orderId }));
  }, [dispatch, orderId]);

  if (loading) return <p className="loading">Cargando detalles del carrito...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!orderDetails)
    return <p className="no-order">No se encontraron datos del carrito.</p>;

  const status = orderDetails.payment_status?.toUpperCase() || "PENDIENTE";
  const isPaid = status === "COMPLETADO";
  const isConfirmed = orderDetails.finalOrder === true;
  const paymentMethod = orderDetails.payment_method;
  const paymentDate = orderDetails.payment_date;

  const formatPaymentMethod = (method) => {
    switch (method) {
      case "TARJETA_CREDITO":
        return "Tarjeta de Crédito";
      case "TARJETA_DEBITO":
        return "Tarjeta de Débito";
      case "TRANSFERENCIA_BANCARIA":
        return "Transferencia Bancaria";
      default:
        return method || "No especificado";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "No disponible";

    const date = new Date(dateStr);
    return date.toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const total = orderDetails.items?.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0
  );

  return (
    <div className="carrito-page">
      <BackButton destino="/profile" texto="Volver al perfil" />

      <h1 className="carrito-titulo">🛒 Mi anterior carrito</h1>

      <div className="carrito-container">
        <div className="carrito-items">
          {orderDetails.items && orderDetails.items.length > 0 ? (
            orderDetails.items.map((item) => (
              <div className="carrito-item" key={item.id}>
                <img
                  src={item.product?.images?.[0] || "/placeholder.jpg"}
                  alt={item.product?.name || "Producto"}
                  className="carrito-img"
                />

                <div className="carrito-info">
                  <p className="carrito-name">{item.product?.name}</p>

                  <strong className="carrito-price">
                    ${Number(item.unitPrice).toFixed(2)}
                  </strong>

                  <strong className="carrito-quantity">
                    Cantidad: {item.quantity}
                  </strong>

                  <strong className="carrito-subtotal">
                    Subtotal: ${(item.unitPrice * item.quantity).toFixed(2)}
                  </strong>
                </div>
              </div>
            ))
          ) : (
            <p className="no-items">Este carrito no tiene productos.</p>
          )}
        </div>

        <div className="carrito-summary">
          <h2 className="carrito-summary_title">Resumen de compra</h2>

          <h3 className="carrito-summary_total">Total: ${total.toFixed(2)}</h3>

          <strong>Estado del pago:</strong>
          <span
            className={`status-badge ${
              isPaid ? "status-completado" : "status-pendiente"
            }`}
          >
            {isPaid ? "Completado" : "Pendiente"}
          </span>

          {isPaid && (
            <div className="payment-info">
              <p>
                <strong>Método:</strong> {formatPaymentMethod(paymentMethod)}
              </p>
              <p>
                <strong>Fecha:</strong> {formatDate(paymentDate)}
              </p>
            </div>
          )}

          {isConfirmed && !isPaid && (
            <button
              className="btn-pagar-carrito"
              onClick={() => navigate(`/payment/${orderDetails.id}`)}
            >
              💳 Pagar ahora
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarritoHistorial;
