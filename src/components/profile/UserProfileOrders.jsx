import { useNavigate } from "react-router-dom";
import "./UserProfileOrders.css";
import lupa from "../../assets/lupa.png";

const UserProfileOrders = ({ order }) => {
  const navigate = useNavigate();

  if (!order) return null;

  const {
    id,
    date,
    total,
    total_quantity,
    payment_status = "PENDIENTE",
  } = order;

  const realStatus = payment_status.toUpperCase();

  const getStatusLabel = (status) =>
    status === "COMPLETADO" ? "COMPLETADO" : "PENDIENTE";

  const getStatusClass = (status) =>
    status === "COMPLETADO" ? "completed" : "pending";

  const handleClick = () => {
    navigate(`/CarritoHistorial/${id}`);
  };

  return (
    <div className="order-item">
      <div className="order-izq">
        <p>
          <strong>Nro de Orden:</strong> {id}
        </p>
        <p>
          <strong>Fecha:</strong> {date}
        </p>
        <p>
          <strong>Total:</strong> ${total}
        </p>
        <p>
          <strong>Cantidad de productos:</strong> {total_quantity}
        </p>
      </div>

      <div className="order-der">
        <span className={`order-status ${getStatusClass(realStatus)}`}>
          {getStatusLabel(realStatus)}
        </span>

        <img
          src={lupa}
          alt="Ver detalles"
          className="lupa-icon"
          onClick={handleClick}
        />
      </div>
    </div>
  );
};

export default UserProfileOrders;
