import React from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ProductCarousel.css";

const ProductCarousel = ({ products }) => {
  const navigate = useNavigate();

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <Slider {...sliderSettings}>
      {products.map((product) => {
        const { id, _id, name, price, images, promotion } = product;
        const finalPrice = promotion
          ? (price - (price * promotion) / 100).toFixed(2)
          : price;

        return (
          <div key={id ?? _id} className="carousel-item">
            <div
              className="carousel-card"
              onClick={() => navigate(`/producto/${id ?? _id}`)}
            >
              <img
                src={images?.[0] || "/assets/placeholder.png"}
                alt={name}
                className="carousel-img"
              />
              <div className="carousel-info">
                <h4 className="carousel-title">{name}</h4>
                {promotion ? (
                  <div className="carousel-prices">
                    <span className="carousel-price-old">${price}</span>
                    <span className="carousel-price-promo">${finalPrice}</span>
                  </div>
                ) : (
                  <p className="carousel-price">${price}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </Slider>
  );
};

export default ProductCarousel;
