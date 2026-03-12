import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ShoppingCart,
  Tag,
  Package,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  Edit3,
  Percent,
} from "lucide-react";

import ProductCarousel from "../../components/products/ProductCarousel";
import "./DetalleProducto.css";

import {
  fetchProductById,
  fetchProductsBySeller,
} from "../../redux/slices/productSlice";

import { fetchGetActive, newItemOrder } from "../../redux/slices/orderSlice";

const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [producto, setProducto] = useState(null);
  const [otrosProductos, setOtrosProductos] = useState([]);
  const [index, setIndex] = useState(0);
  const [cantidad, setCantidad] = useState(1);

  const { token, user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchProductById(id)).then((res) => {
      const data = res.payload;
      if (!data) return;

      setProducto(data);

      if (data.sellerName) {
        dispatch(fetchProductsBySeller({ sellerName: data.sellerName })).then(
          (resp) => {
            const productosExtra = resp.payload || [];
            const filtrados = Array.isArray(productosExtra)
              ? productosExtra.filter((p) => p.id !== data.id)
              : [];
            setOtrosProductos(filtrados);
          }
        );
      }
    });
  }, [dispatch, id]);

  if (!producto) {
    return <div className="loading">Cargando producto...</div>;
  }

  if (producto.active === false) {
    return (
      <div className="detalle-container">
        <button onClick={() => navigate(-1)} className="btn-volver">
          <ArrowLeft size={16} /> Volver
        </button>

        <h2 style={{ marginTop: "40px", color: "red", textAlign: "center" }}>
          Lo sentimos, este producto ya no se enceuntra disponible.
        </h2>
      </div>
    );
  }

  const getImageUrl = (img) => {
    if (!img) return "";
    if (typeof img === "string") return img;
    if (img.image_url) return img.image_url;
    return "";
  };

  const precioFinal = producto.promotion
    ? (producto.price - producto.price * (producto.promotion / 100)).toFixed(2)
    : producto.price;

  const handleAgregarCarrito = () => {
    if (!token) {
      alert("⚠️ Debes iniciar sesión para agregar productos al carrito.");
      navigate("/login");
      return;
    }

    dispatch(fetchGetActive()).then((res) => {
      const order = res.payload;
      if (!order) {
        alert("❌ No se pudo obtener el carrito activo.");
        return;
      }

      dispatch(
        newItemOrder({
          order_id: order.id,
          itemRequest: {
            productId: producto.id,
            quantity: cantidad,
          },
        })
      ).then(() => {
        dispatch(fetchGetActive());
        alert("✅ Producto agregado al carrito con éxito!");
      });
    });
  };

  const incrementar = () => {
    if (cantidad < producto.stock) setCantidad(cantidad + 1);
  };

  const decrementar = () => {
    if (cantidad > 1) setCantidad(cantidad - 1);
  };

  const roles = user?.roles ?? [];
  const isUser = roles.includes("USER");

  const isOwner =
    roles.includes("SELLER") &&
    producto.sellerName?.trim().toLowerCase() ===
      user?.name?.trim().toLowerCase();

  return (
    <>
      <div className="detalle-container">
        <div className="detalle-imagen">
          <div className="volver-externo">
            <button onClick={() => navigate(-1)} className="btn-volver">
              <ArrowLeft size={16} /> Volver
            </button>
          </div>

          {producto.images?.length > 0 && (
            <div className="carrusel">
              <button
                onClick={() =>
                  setIndex(
                    (index - 1 + producto.images.length) %
                      producto.images.length
                  )
                }
                disabled={producto.images.length === 1}
              >
                <ChevronLeft size={28} />
              </button>

              {getImageUrl(producto.images[index]) ? (
                <img
                  src={getImageUrl(producto.images[index])}
                  alt={`Imagen ${index + 1}`}
                />
              ) : (
                <div className="imagen-placeholder">Imagen no disponible</div>
              )}

              <button
                onClick={() => setIndex((index + 1) % producto.images.length)}
                disabled={producto.images.length === 1}
              >
                <ChevronRight size={28} />
              </button>
            </div>
          )}

          <div className="detalle-extra">
            <span
              className={
                producto.stock > 0 ? "stock-disponible" : "sin-stock"
              }
            >
              <Package size={18} />{" "}
              {producto.stock > 0
                ? `En stock (${producto.stock})`
                : "Sin stock"}
            </span>

            <div className="detalle-categorias">
              <Tag size={18} />
              <p>Categoría:</p>
              <ul>{producto.category && <li>{producto.category.name}</li>}</ul>
            </div>

            <p>
              Vendedor:{" "}
              <span className="link-vendedor">{producto.sellerName}</span>
            </p>
          </div>
        </div>

        <div className="detalle-info">
          <h1>{producto.name}</h1>
          <p className="descripcion">{producto.description}</p>

          <div style={{ height: "25px" }} />

          <div>
            {producto.promotion ? (
              <div className="precio-promocion">
                <p className="precio-original">
                  <Tag size={18} />{" "}
                  <span className="tachado">${producto.price}</span>
                </p>
                <p className="precio-promocion-final">
                  Precio:{" "}
                  <span className="monto-promocion">${precioFinal}</span>
                </p>
              </div>
            ) : (
              <p className="precio-promocion-final">
                Precio:{" "}
                <span className="monto-promocion">${producto.price}</span>
              </p>
            )}
          </div>

          {isOwner && producto.stock > 0 && (
            <div className="acciones-vendedor">
              <button
                className="btn-edit"
                onClick={() => navigate(`/seller/edit-product/${producto.id}`)}
              >
                <Edit3 size={16} /> Editar producto
              </button>

              <button
                className="btn-promo"
                onClick={() =>
                  navigate(`/seller/edit-promotion/${producto.id}`)
                }
              >
                <Percent size={16} /> Modificar promoción
              </button>

              <button
                className="btn-delete"
                onClick={() =>
                  navigate(`/seller/delete-product/${producto.id}`)
                }
              >
                <Trash2 size={16} /> Eliminar producto
              </button>
            </div>
          )}

          {isUser && (
            <div className="detalle-compra">
              <label>Cantidad:</label>

              <div className="contador">
                <button onClick={decrementar} disabled={cantidad <= 1}>
                  <Minus size={10} />
                </button>
                <span>{cantidad}</span>
                <button
                  onClick={incrementar}
                  disabled={cantidad >= producto.stock}
                >
                  <Plus size={10} />
                </button>
              </div>

              <button
                className="btn-agregar"
                onClick={handleAgregarCarrito}
                disabled={producto.stock <= 0}
              >
                <ShoppingCart size={18} /> Agregar al carrito
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="detalle-extras">
        <hr className="separador" />
        <h3 className="detalle-otros-titulo">
          Otros productos de {producto.sellerName}
        </h3>
        <hr className="separador" />

        {otrosProductos.length > 0 ? (
          <ProductCarousel products={otrosProductos} />
        ) : (
          <p className="sin-mas-productos">
            No hay más productos de este vendedor.
          </p>
        )}
      </div>
    </>
  );
};

export default DetalleProducto;
