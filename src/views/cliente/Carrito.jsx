import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Minus, Trash2 } from "lucide-react";
import "./Carrito.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGetActive,
  updateItemQuantity,
  deleteOrder,
  deleteOrderItems,
  confirmOrders,
} from "../../redux/slices/orderSlice";
import BackButton from "../../components/BackButton";
import { logout, resetLogoutFlag } from "../../redux/slices/userSlice";

const Carrito = () => {
  const dispatch = useDispatch();
  const { order } = useSelector((state) => state.orders);
  const alertShown = useRef(false);
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.user);
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
        showAlertOnce("⚠ Debes iniciar sesión.");
      } else {
        dispatch(resetLogoutFlag());
      }
      dispatch(logout());
      navigate("/login");
      return;
    }

    if (user?.roles && !user.roles.includes("USER")) {
      showAlertOnce("⚠ Solo los clientes pueden acceder al carrito.");
      dispatch(logout());
      navigate("/");
      return;
    } else {
      dispatch(fetchGetActive());
    }
  }, [token, user, navigate, dispatch, userState?.isLoggingOut]);

  const handleQuantityChange = (itemId, newQuantity, stock) => {
    if (order?.finalOrder)
      return alert("⚠ No puedes modificar el carrito después de confirmarlo.");

    if (newQuantity < 1) return;
    if (newQuantity > stock)
      return alert("⚠ Lo sentimos, no hay stock suficiente.");

    const itemData = order.items.find((i) => i.id === itemId);
    if (!itemData) return alert("❌ Error interno: item no encontrado.");

    dispatch(
      updateItemQuantity({
        order_id: order.id,
        items_id: itemId,
        itemRequest: {
          productId: itemData.product.id,
          quantity: newQuantity,
        },
      })
    )
      .unwrap()
      .catch((error) => {
        alert(
          "❌ No se pudo actualizar la cantidad, falta stock " ||
            error.message ||
            "Intenta de nuevo"
        );
      });
  };

  const handleRemoveItem = (itemId) => {
    if (order.finalOrder)
      return alert("⚠ No puedes modificar el carrito después de confirmarlo.");

    dispatch(
      deleteOrderItems({
        order_id: order.id,
        items_id: itemId,
      })
    )
      .unwrap()
      .catch((error) => {
        alert(
          "❌ No se pudo eliminar el producto: " +
            (error.message || "Intenta de nuevo")
        );
      });
  };

  const handleDeleteOrder = () => {
    if (!order) return;

    dispatch(deleteOrder({ id: order.id }))
      .unwrap()
      .then(() => {
        alert("🗑 Pedido eliminado correctamente.");
      })
      .catch((error) => {
        alert(
          "❌ Error al eliminar el pedido: " +
            (error.message || "Intenta de nuevo")
        );
      });
  };

  const handleConfirmOrder = () => {
    if (!order) return;

    dispatch(confirmOrders({ id: order.id }))
      .unwrap()
      .then(() => {
        alert(
          "✅ Pedido confirmado correctamente. Ahora puedes proceder al pago."
        );
      })
      .catch((error) => {
        alert(
          "❌ No se pudo confirmar el pedido: " +
            (error.message || "Intenta de nuevo")
        );
      });
  };

  const handleProceedToPayment = () => {
    if (!order.finalOrder)
      return alert("⚠ Debes confirmar el pedido antes de proceder al pago.");

    navigate(`/payment/${order.id}`);
  };

  if (!order || !order.items?.length) {
    return (
      <div className="carrito-page">
        <BackButton destino="/" texto="Volver al Home" />
        <h1 className="carrito-titulo">🛒 Mi carrito</h1>

        <div className="carrito-vacio">
          <p className="carrito-vacio-texto">Tu carrito está vacío :c 🛍</p>

          <div className="carrito-summary vacio">
            <h2 className="carrito-summary_title">Resumen de compra</h2>
            <h3 className="carrito-summary_total">Total: $0.00</h3>

            <button className="btn-eliminar-carrito" disabled>
              🗑 Eliminar Pedido
            </button>
            <button className="btn-confirmar-carrito" disabled>
              ✅ Confirmar Pedido
            </button>
            <button className="btn-pagar" disabled>
              💳 Proceder al Pago
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="carrito-page">
      <BackButton destino="/" texto="Volver al Home" />
      <h1 className="carrito-titulo">🛒 Mi carrito</h1>

      <div className="carrito-container">
        <div className="carrito-items">
          {order.items.map((item) => (
            <div className="carrito-item" key={item.id}>
              <img
                src={item.product?.images?.[0]}
                alt={item.product?.name}
                className="carrito-img"
              />

              <div className="carrito-info">
                <p className="carrito-name">{item.product?.name}</p>
                <p className="carrito-price">
                  ${item.unitPrice?.toFixed(2) ?? item.product?.price}
                </p>
              </div>

              <div className="carrito-actions">
                <button
                  className="carrito-delete"
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={order?.finalOrder}
                >
                  <Trash2 size={25} />
                </button>

                <div className="carrito-quantity">
                  <label>Cant:</label>

                  <div className="contador">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.id,
                          item.quantity - 1,
                          item.product.stock
                        )
                      }
                      disabled={item.quantity <= 1 || order?.finalOrder}
                    >
                      <Minus size={18} />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.id,
                          item.quantity + 1,
                          item.product.stock
                        )
                      }
                      disabled={
                        item.quantity >= item.product.stock || order?.finalOrder
                      }
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="carrito-summary">
          <h2 className="carrito-summary_title">Resumen de compra</h2>

          <h3 className="carrito-summary_total">
            Total: $
            {order.items
              .reduce((acc, i) => acc + i.unitPrice * i.quantity, 0)
              .toFixed(2)}
          </h3>

          <div className="carrito-buttons">
            <button
              className="btn-eliminar-carrito"
              onClick={handleDeleteOrder}
              disabled={order?.finalOrder}
            >
              🗑{" "}
              {order?.finalOrder
                ? "Bloqueado por Confirmación"
                : "Eliminar Pedido"}
            </button>

            <button
              className="btn-confirmar-carrito"
              onClick={handleConfirmOrder}
              disabled={order?.finalOrder}
            >
              ✅ {order?.finalOrder ? "Pedido Confirmado" : "Confirmar Pedido"}
            </button>

            <button
              className="btn-pagar"
              onClick={handleProceedToPayment}
              disabled={!order?.finalOrder}
            >
              💳 Proceder al Pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carrito;
