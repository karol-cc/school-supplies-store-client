import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { logout } from "../../redux/slices/userSlice";
import { fetchProductById, updateProduct } from "../../redux/slices/productSlice";
import "./EditarProducto.css";

export default function EditarProducto() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product, loading } = useSelector((state) => state.products);
  const { user, token, isLoggingOut } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    stock: "",
    price: "",
    promotion: "",
    images: [""],
  });

  const [errorImages, setErrorImages] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!token) {
      if (!isLoggingOut) alert("Debes iniciar sesión.");
      dispatch(logout());
      navigate("/login");
      return;
    }

    if (!user?.roles?.includes("SELLER") && !user?.roles?.includes("ADMIN")) {
      alert("No tienes permiso para editar productos.");
      navigate("/");
      return;
    }
  }, [token, user, isLoggingOut, dispatch, navigate]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        stock: product.stock || "",
        price: product.price || "",
        promotion: product.promotion || 0,
        images: product.images?.length ? product.images : [""],
      });
    }
  }, [product]);

  const handleChangeField = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangeImage = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData({ ...formData, images: updatedImages });
  };

  const handleAddImage = () => {
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  const handleRemoveImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages.length ? updatedImages : [""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedImages = formData.images.map((img) => img.trim()).filter((img) => img !== "");

    if (cleanedImages.length === 0) {
      setErrorImages(true);
      return;
    }

    setErrorImages(false);

    const updatedProduct = {
      id,
      name: formData.name,
      description: formData.description,
      stock: Number(formData.stock),
      price: Number(formData.price),
      categoryId: product.categoryId,
      active: product.active,
      images: cleanedImages,
    };

    try {
      await dispatch(updateProduct(updatedProduct)).unwrap();
      alert("Producto actualizado correctamente");
      navigate("/");
    } catch {
      alert("Hubo un error al actualizar el producto.");
    }
  };

  if (loading || !product) {
    return <p className="cargando-editar">Cargando producto...</p>;
  }

  return (
    <div className="editar-producto-container">

      <button className="btn-volver-editar" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Volver
      </button>

      <h2 className="editar-producto-title">Editar Producto</h2>

      <form className="editar-producto-form" onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChangeField} required />

        <label>Descripción:</label>
        <textarea name="description" value={formData.description} onChange={handleChangeField} required />

        <label>Stock:</label>
        <input type="number" name="stock" value={formData.stock} onChange={handleChangeField} required />

        <label>Precio:</label>
        <input type="number" name="price" value={formData.price} onChange={handleChangeField} required />

        <label>URLs de imágenes:</label>

        {formData.images.map((img, index) => (
          <div key={index} className="image-input-row">
            <input
              type="text"
              value={img}
              onChange={(e) => handleChangeImage(index, e.target.value)}
              className={errorImages && !img.trim() ? "input-error" : ""}
            />
            <button
              type="button"
              className="btn-delete-crearproduct"
              onClick={() => handleRemoveImage(index)}
            >
              ✕
            </button>
          </div>
        ))}

        {errorImages && <p className="error-crearp">Debe ingresar al menos una imagen válida.</p>}

        <button type="button" className="btn-add-crearproduct" onClick={handleAddImage}>
          Agregar imagen
        </button>

        <button type="submit" className="editar-producto-btn">Guardar Cambios</button>
      </form>
    </div>
  );
}
