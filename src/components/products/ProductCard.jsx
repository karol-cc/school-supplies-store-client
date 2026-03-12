import "./ProductCard.css";
import { Link } from "react-router-dom";
import promoIcon from "../../assets/promocion.png";

const ProductCard = ({ product }) => {
  if (!product) return null;

  const { id, name, price, images, promotion } = product;

  return (
    <Link
      to={`/producto/${id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="product-card" style={{ animation: "fadeIn 0.6s" }}>
        {promotion !== null && (
          <img src={promoIcon} alt="Promoción" className="promo-badge" />
        )}
        <span
          style={{ fontSize: "2rem", marginBottom: "4px" }}
          role="img"
          aria-label="Producto"
        ></span>
        <img src={images[0]} alt={name} className="product-image" />
        <h3 title={name}>{name}</h3>
        {product.stock === 0 && (
          <div className="out-of-stock-banner">Fuera de stock</div>
        )}
        {promotion ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2px",
            }}
          >
            <span
              style={{
                textDecoration: "line-through",
                color: "#a0a0a0",
                fontSize: "0.95rem",
              }}
            >
              ${price}
            </span>
            <span
              style={{ color: "#04b404", fontWeight: 700, fontSize: "1.1rem" }}
            >
              ${price - (price * promotion) / 100}{" "}
              <span
                style={{ fontSize: "1rem" }}
                role="img"
                aria-label="Promoción"
              ></span>
            </span>
          </div>
        ) : (
          <p>${price}</p>
        )}
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Link>
  );
};

export default ProductCard;
