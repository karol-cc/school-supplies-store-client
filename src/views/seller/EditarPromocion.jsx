import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Percent } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductById,
  updatePromotion,
} from "../../redux/slices/productSlice";
import "./EditarPromocion.css";

const EditarPromocion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { product, loading, error } = useSelector((state) => state.products);
  const { user, token } = useSelector((state) => state.user);

  const [promotion, setPromotion] = useState(0);
  const [errorLocal, setErrorLocal] = useState("");

  useEffect(() => {
    if (!token) {
      alert("Debes iniciar sesión.");
      navigate("/login");
      return;
    }

    if (!user?.roles?.includes("SELLER") && !user?.roles?.includes("ADMIN")) {
      alert("No tienes permiso para modificar promociones.");
      navigate("/");
      return;
    }
  }, [token, user, navigate]);

  useEffect(() => {
    dispatch(fetchProductById(id)).then((action) => {
      if (!action.error) {
        setPromotion(action.payload.promotion || 0);
      }
    });
  }, [dispatch, id]);

  useEffect(() => {
    if (!product) return;

    if (product.sellerName && product.sellerName !== user?.name) {
      alert("No tienes permiso para editar la promoción de este producto.");
      navigate("/");
    }
  }, [product, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const promoNum = Number(promotion);

    if (promoNum < 0 || promoNum > 100) {
      setErrorLocal("El descuento debe estar entre 0 y 100.");
      return;
    }

    try {
      await dispatch(updatePromotion({ id, promotion: promoNum })).unwrap();

      alert("✅ Promoción actualizada con éxito");
      navigate(`/producto/${id}`);
    } catch (err) {
      console.error("Error al actualizar promoción:", err);
      setErrorLocal(err.message || "Error desconocido.");
    }
  };

  if (loading || !product) {
    return <div className="loading">Cargando producto...</div>;
  }

  return (
    <div className="edit-promo-container">
      <button onClick={() => navigate(-1)} className="btn-volver">
        <ArrowLeft size={16} /> Volver
      </button>

      <h2>
        <Percent size={20} /> Editar promoción para: {product.name}
      </h2>

      <form onSubmit={handleSubmit} className="form-promocion">
        <label htmlFor="promotion">Porcentaje de descuento:</label>

        <input
          type="number"
          id="promotion"
          value={promotion}
          onChange={(e) => setPromotion(e.target.value)}
          min="0"
          max="100"
          required
        />

        {(errorLocal || error) && (
          <p className="error">{errorLocal || error}</p>
        )}

        <button type="submit" className="btn-confirmar">
          Aplicar descuento
        </button>
      </form>
    </div>
  );
};

export default EditarPromocion;
