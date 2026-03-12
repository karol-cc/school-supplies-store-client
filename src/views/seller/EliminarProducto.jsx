import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Trash2, ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductById,
  deleteProduct,
} from "../../redux/slices/productSlice";
import "./EliminarProducto.css";

const EliminarProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { product, loading, error } = useSelector((state) => state.products);
  const { user, token } = useSelector((state) => state.user);
  const [errorLocal, setErrorLocal] = useState("");

  useEffect(() => {
    if (!token) {
      alert("Debes iniciar sesión para eliminar productos.");
      navigate("/login");
      return;
    }

    if (!user?.roles?.includes("SELLER") && !user?.roles?.includes("ADMIN")) {
      alert("No tienes permiso para eliminar productos.");
      navigate("/");
    }
  }, [token, user, navigate]);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!product) return;

    const sellerName = product?.seller?.name;
    if (sellerName && user?.name !== sellerName) {
      alert("No tienes permiso para eliminar este producto.");
      navigate("/");
    }
  }, [product, user, navigate]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteProduct({ id })).unwrap();
      alert("✅ Producto eliminado correctamente");
      navigate("/");
    } catch (error) {
      setErrorLocal(error.message || "Error al eliminar producto.");
    }
  };

  if (loading || !product) {
    return <div className="loading">Cargando producto...</div>;
  }

  return (
    <div className="eliminar-container">
      <button onClick={() => navigate(-1)} className="btn-volver">
        <ArrowLeft size={16} /> Volver
      </button>

      <h2>
        <Trash2 size={20} /> Eliminar producto
      </h2>

      <p>
        ¿Estás seguro que deseas eliminar <strong>{product.name}</strong>?
      </p>

      {(error || errorLocal) && (
        <p className="error">{errorLocal || error}</p>
      )}

      <div className="acciones-eliminar">
        <button className="btn-cancelar-eliminar" onClick={() => navigate(-1)}>
          Cancelar
        </button>

        <button className="btn-confirmar-eliminar" onClick={handleDelete}>
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default EliminarProducto;
