import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PlusCircle } from "lucide-react";
import "./CrearProducto.css";

import { useDispatch, useSelector } from "react-redux";

import { fetchCategories } from "../../redux/slices/categorySlice";
import { createProduct } from "../../redux/slices/productSlice";
import { logout, resetLogoutFlag } from "../../redux/slices/userSlice";

const CrearProducto = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token, user, isLoggingOut } = useSelector((state) => state.user);
  const {
    items: categorias,
    loading: loadingCategorias,
    error: errorCategorias,
  } = useSelector((state) => state.categories);

  const { loading: loadingProduct, error: errorProduct } = useSelector(
    (state) => state.products
  );

  const alertShown = useRef(false);
  const showAlertOnce = (msg) => {
    if (!alertShown.current) {
      alertShown.current = true;
      alert(msg);
    }
  };

  useEffect(() => {
    if (!token) {
      if (!isLoggingOut) showAlertOnce("Debes iniciar sesión.");
      else dispatch(resetLogoutFlag());
      dispatch(logout());
      navigate("/login");
      return;
    }

    if (!user?.roles?.includes("SELLER") && !user.roles?.includes("ADMIN")) {
      showAlertOnce("No tienes permiso para crear productos.");
      navigate("/");
      return;
    }
  }, [token, user, navigate, dispatch, isLoggingOut]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    stock: 0,
    price: 0,
    promotion: 0,
    categoryId: "",
    images: [""],
    active: true,
  });

  const handleChange = (e, index = null) => {
    const { name, value, type, checked } = e.target;

    if (name === "images") {
      const updatedImages = [...formData.images];
      updatedImages[index] = value.trim();
      setFormData({ ...formData, images: updatedImages });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addImageField = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };

  const removeImageField = (index) => {
    if (formData.images.length === 1) {
      alert("El producto debe tener al menos 1 imagen.");
      return;
    }

    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const filteredImages = formData.images.filter((img) => img.trim() !== "");

    if (filteredImages.length === 0) {
      alert("El producto debe tener al menos una imagen válida.");
      return;
    }

    try {
      const payload = {
        ...formData,
        stock: Number(formData.stock),
        price: Number(formData.price),
        promotion:
          Number(formData.promotion) === 0 ? null : Number(formData.promotion),
        images: filteredImages,
      };

      const result = await dispatch(createProduct(payload)).unwrap();

      alert("✅ Producto creado con éxito");
      navigate(`/producto/${result.id}`);
    } catch (err) {
      console.error("❌ Error al crear producto:", err);
      alert(err.message || "Error al crear producto");
    }
  };

  return (
    <div className="crear-producto-container">
      <button onClick={() => navigate(-1)} className="btn-volver">
        <ArrowLeft size={16} /> Volver
      </button>

      <h2>
        <PlusCircle size={20} /> Crear nuevo producto
      </h2>

      <form onSubmit={handleSubmit} className="form-crear-producto">
        <label>Nombre:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Descripción:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label>Stock:</label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          min="0"
          required
        />

        <label>Precio:</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          min="0"
          required
        />

        <label>Promoción (%):</label>
        <input
          type="number"
          name="promotion"
          value={formData.promotion}
          onChange={handleChange}
          min="0"
          max="100"
        />

        <label>Categoría:</label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar categoría</option>

          {loadingCategorias && <option>Cargando...</option>}
          {errorCategorias && <option>Error al cargar categorías</option>}

          {!loadingCategorias &&
            categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
        </select>

        <label>Imágenes:</label>
        {formData.images.map((img, index) => (
          <div key={index} className="image-input-row">
            <input
              type="text"
              name="images"
              value={img}
              onChange={(e) => handleChange(e, index)}
              placeholder={`URL de imagen ${index + 1}`}
              required={index === 0}
            />

            <button
              type="button"
              className="btn-delete-crearproduct"
              onClick={() => removeImageField(index)}
              disabled={formData.images.length === 1}
            >
              ❌
            </button>
          </div>
        ))}

        <button
          type="button"
          className="btn-add-crearproduct"
          onClick={addImageField}
        >
          Agregar otra imagen
        </button>

        {(errorProduct || errorCategorias) && (
          <p className="error-crearp">{errorProduct || errorCategorias}</p>
        )}

        <button
          type="submit"
          className="btn-confirmar-crearp"
          disabled={loadingProduct}
        >
          {loadingProduct ? "Creando..." : "Crear producto"}
        </button>
      </form>
    </div>
  );
};

export default CrearProducto;
