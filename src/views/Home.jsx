import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import { fetchCategories } from "../redux/slices/categorySlice";
import ProductCard from "../components/products/ProductCard";
import "./Home.css";

const getFinalPrice = (product) => {
  const originalPrice =
    typeof product.price === "number"
      ? product.price
      : parseFloat(product.price);

  if (isNaN(originalPrice)) return 0;

  if (
    product.promotion &&
    typeof product.promotion === "number" &&
    product.promotion > 0
  ) {
    const discountRate = product.promotion / 100;
    return originalPrice - originalPrice * discountRate;
  }

  return originalPrice;
};

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    items: productos,
    loading: productosLoading,
    error: productosError,
  } = useSelector((state) => state.products);

  const {
    items: categorias,
    loading: categoriasLoading,
    error: categoriasError,
  } = useSelector((state) => state.categories);

  const { user, token } = useSelector((state) => state.user);

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [soloPromociones, setSoloPromociones] = useState(false);
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");

  let userType = "guest";
  if (user && token) {
    if (user.roles?.includes("ADMIN")) userType = "admin";
    else if (user.roles?.includes("SELLER")) userType = "seller";
    else userType = "user";
  }

  const obtenerBusqueda = () => {
    const params = new URLSearchParams(location.search);
    return params.get("busqueda");
  };

  const busqueda = obtenerBusqueda();
  const terminoBusqueda = busqueda ? busqueda.toLowerCase().trim() : "";

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const parsedMin = parseFloat(precioMin);
  const parsedMax = parseFloat(precioMax);
  const minPriceFilter = isNaN(parsedMin) || parsedMin < 0 ? 0 : parsedMin;
  const maxPriceFilter =
    isNaN(parsedMax) || parsedMax <= 0 ? Infinity : parsedMax;

  const productosFiltrados = productos.filter((producto) => {
    if (!producto.active) return false;
    const productoFinalPrice = getFinalPrice(producto);
    if (isNaN(productoFinalPrice)) return false;

    const enCategoria = categoriaSeleccionada
      ? producto.category && producto.category.name === categoriaSeleccionada
      : true;

    const enPromo = soloPromociones ? producto.promotion !== null : true;

    const enRango =
      productoFinalPrice >= minPriceFilter &&
      productoFinalPrice <= maxPriceFilter;

    const enBusqueda = terminoBusqueda
      ? (producto.name &&
          producto.name.toLowerCase().includes(terminoBusqueda)) ||
        (producto.description &&
          producto.description.toLowerCase().includes(terminoBusqueda)) ||
        (producto.category &&
          producto.category.name &&
          producto.category.name.toLowerCase().includes(terminoBusqueda))
      : true;

    return enCategoria && enPromo && enRango && enBusqueda;
  });

  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
    const aPromo = a.promotion !== null;
    const bPromo = b.promotion !== null;
    if (aPromo && !bPromo) return -1;
    if (!aPromo && bPromo) return 1;

    const aStock = a.stock > 0;
    const bStock = b.stock > 0;
    if (aStock && !bStock) return -1;
    if (!aStock && bStock) return 1;

    return 0;
  });

  if (productosLoading || categoriasLoading) {
    return (
      <div className="loading-state">
        <p>Cargando productos y categorías...</p>
      </div>
    );
  }

  if (productosError || categoriasError) {
    return (
      <div className="error-state">
        Error al cargar datos: {productosError || categoriasError}
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="home-hero-section">
        <div className="welcome-content">
          <div className="welcome-blur-box">
            <h2 className="welcome-title">
              <span className="welcome-icon"> ⚡​​</span> ¡Bienvenido a
              SuperStudy! ⚡​
            </h2>
            <p className="welcome-subtitle">
              DESCUBRE LOS MEJORES PRODUCTOS PARA TU REGRESO A CLASES
            </p>

            {userType !== "guest" && (
              <p className="welcome-user">
                Hola{" "}
                <strong>
                  {userType === "admin"
                    ? "Administrador"
                    : userType === "seller"
                    ? "Vendedor"
                    : "Usuario"}
                </strong>
                , ¡disfruta de tu experiencia!
              </p>
            )}

            <div className="welcome-features">
              <div className="feature-item">
                <span className="feature-icon">🦸‍♂️​</span>{" "}
                <span>PRODUCTOS DE CALIDAD</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🦹​</span>{" "}
                <span>OFERTAS ESPECIALES</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="home-layout">
        <aside className="filtro-lateral">
          <h3>UTILERÍA ESCOLAR</h3>

          <div>
            <h4>CATEGORÍAS ESCOLARES</h4>
            <ul>
              <li
                onClick={() => {
                  setCategoriaSeleccionada(null);
                  navigate("/");
                }}
                className={!categoriaSeleccionada ? "activo" : ""}
              >
                Todas
              </li>
              {categorias.map((cat) => (
                <li
                  key={cat.id}
                  onClick={() => setCategoriaSeleccionada(cat.name)}
                  className={
                    categoriaSeleccionada === cat.name ? "activo" : ""
                  }
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="filtro-promo">
            <label className="checkbox-redondo">
              <input
                type="checkbox"
                checked={soloPromociones}
                onChange={() => setSoloPromociones(!soloPromociones)}
              />
              <span className="check-redondo"></span>
              OFERTAS ESPECIALES
            </label>
          </div>

          <div className="filtro-precio">
            <h4>RANGO DE PRECIOS</h4>
            <input
              type="number"
              placeholder="Mínimo"
              value={precioMin}
              onChange={(e) => setPrecioMin(e.target.value)}
            />
            <input
              type="number"
              placeholder="Máximo"
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value)}
            />
          </div>
        </aside>

        <section className="productos-container">
          {productosOrdenados.length > 0 ? (
            productosOrdenados.map((producto) => (
              <ProductCard key={producto.id} product={producto} />
            ))
          ) : (
            <p
              style={{
                textAlign: "center",
                width: "100%",
                padding: "20px",
                fontSize: "1.2rem",
              }}
            >
              No se encontraron productos con los filtros aplicados
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
