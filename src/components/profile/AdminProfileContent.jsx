import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchGetUsersMe } from "../../redux/slices/userSlice";

import "./AdminProfileContent.css";
import usuario from "../../assets/usuario.png";

const AdminProfileContent = () => {
  const dispatch = useDispatch();

  const { user, token } = useSelector((state) => state.user);

  useEffect(() => {
    if (token) {
      dispatch(fetchGetUsersMe());
    }
  }, [token, dispatch]);

  if (!user) {
    return <p className="loading">Cargando administrador...</p>;
  }

  const { name, email, firstName, lastName, address, cellphone, role } = user;

  const fullName =
    `${firstName || ""} ${lastName || ""}`.trim() || "No especificado";

  return (
    <div className="admin-profile-card">
      <div className="admin-profile-icon">
        <img src={usuario} alt="Avatar de administrador" />
      </div>

      <div className="admin-info">
        <p className="username-admin">{name || "Administrador Principal"}</p>
        <span className="role-tag-admin">{role || "ADMINISTRADOR"}</span>

        <div className="profile-data-list">
          <div className="data-item-admin">
            <strong>Nombre Completo</strong> {fullName}
          </div>

          <div className="data-item-admin">
            <strong>Email</strong> {email || "No disponible"}
          </div>

          <div className="data-item-admin">
            <strong>Dirección</strong> {address || "No especificado"}
          </div>

          <div className="data-item-admin">
            <strong>Celular</strong> {cellphone || "No especificado"}
          </div>
        </div>
      </div>

      <div className="admin-note-banner">
        <p>
          <strong>Clave de la Plataforma:</strong> {firstName || "Admin"},
          ¡Utiliza tus privilegios con **sabiduría, cautela y máxima
          responsabilidad**.
        </p>
      </div>
    </div>
  );
};

export default AdminProfileContent;
