import { useNavigate } from "react-router-dom";
import "./BackButton.css";

/**
 * Componente de Botón para Volver.
 *
 * @param {object} props
 * @param {string} props.destino
 * @param {string} [props.texto="Volver"]
 * @param {string} [props.className=""]
 */

const BackButton = ({ destino, texto = "Volver", className = "" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(destino);
  };

  return (
    <button onClick={handleClick} className={`boton-volver ${className}`}>
      <span className="icon-volver">&#x2190;</span>
      {texto}
    </button>
  );
};

export default BackButton;
