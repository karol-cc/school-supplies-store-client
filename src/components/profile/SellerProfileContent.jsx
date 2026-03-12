import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";

import usuario from "../../assets/usuario.png";
import "./SellerProfileContent.css";

import ProductCarousel from "../../components/products/ProductCarousel";

import {
  logout,
  resetLogoutFlag,
  fetchGetUsersMe,
} from "../../redux/slices/userSlice";
import { fetchProductsBySeller } from "../../redux/slices/productSlice";

const SellerProfileContent = ({ profileData }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, token, isLoggingOut } = useSelector((state) => state.user);
  const { items: productosVendedor, loading, error } = useSelector(
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
      if (!isLoggingOut) showAlertOnce("Debes iniciar sesión para continuar.");
      dispatch(resetLogoutFlag());
      dispatch(logout());
      navigate("/login");
      return;
    }

    if (!user?.roles?.includes("SELLER")) {
      showAlertOnce("Solo los vendedores pueden acceder a esta sección.");
      dispatch(logout());
      navigate("/");
      return;
    }
  }, [token, user, dispatch, navigate, isLoggingOut]);

  useEffect(() => {
    if (token) {
      dispatch(fetchGetUsersMe());
    }
  }, [token, dispatch]);

  useEffect(() => {
    const sellerName = (user && user.name) || (profileData && profileData.name);
    if (sellerName) {
      dispatch(fetchProductsBySeller({ sellerName }));
    }
  }, [user, profileData, dispatch]);

  const productosVisibles = productosVendedor?.filter(
    (p) => p.active === true
  );

  const source = user || profileData || {};
  const { name, email, firstName, lastName, address, cellphone, role } =
    source;

  const fullName =
    `${firstName || ""} ${lastName || ""}`.trim() || "No especificado";

  return (
    <>
      <div className="seller-profile-card">
        <div className="seller-profile-icon">
          <img src={usuario} alt="Avatar Seller" />
        </div>

        <div className="seller-info">
          <p className="username-seller">{name || "Vendedor"}</p>
          <span className="role-tag-seller">{role || "SELLER"}</span>

          <div className="profile-data-list">
            <div className="data-item-seller">
              <strong>Nombre Completo:</strong> {fullName}
            </div>

            <div className="data-item-seller">
              <strong>Email:</strong> {email || "No especificado"}
            </div>

            <div className="data-item-seller">
              <strong>Dirección:</strong> {address || "No especificado"}
            </div>

            <div className="data-item-seller">
              <strong>Celular:</strong> {cellphone || "No especificado"}
            </div>
          </div>
        </div>

        <button
          className="btn-crear"
          onClick={() => navigate("/seller/create-product")}
        >
          <PlusCircle size={16} /> Crear producto
        </button>
      </div>

      <div className="seller-inventory-section">
        <hr className="separador" />
        <h3 className="detalle-otros-titulo">
          Catálogo del vendedor: {name || "Vendedor"}
        </h3>
        <hr className="separador" />

        {loading && <p className="loading">Cargando productos...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && productosVisibles?.length > 0 ? (
          <ProductCarousel products={productosVisibles} />
        ) : (
          !loading && (
            <p className="sin-mas-productos">
              Este vendedor aún no tiene productos.
            </p>
          )
        )}
      </div>
    </>
  );
};

export default SellerProfileContent;
